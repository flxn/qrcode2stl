import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import { CSG } from 'three-csg-ts';
import BaseTag3D from './base';
import { getRoundedRectShape, getBoundingBoxSize, subtractMesh } from './utils';

/**
 * Class used for generating the 3D model from a bitmask that contains the QR Code Data.
 * qrCodeBitmask must be a square number (QR Code of dimensions 21x21 => Bitmask of length 441 (21*21)).
 */
class QRCode3D extends BaseTag3D {
  constructor(qrCodeBitmask, options) {
    super(options);
    this.bitMask = qrCodeBitmask;
    this.maskWidth = Math.sqrt(this.bitMask.length);
    this.iconMesh = null;
    this.qrcodeMesh = null;
    this.exportedMeshes = super.getPartMeshes();
    // the width of the actual qr code blocks
    this.blockWidth = (this.availableWidth / this.maskWidth) * (this.options.code.blockSizeMultiplier / 100);
    // Track icon compatibility status
    this.iconCompatibilityStatus = {
      isCompatibilityMode: false,
      wasSimplified: false,
      fallbackLevel: 0,
      hasHoles: false,
      holesRemoved: false
    };
  }

  /**
   * @return {THREE.Mesh} the 3D mesh of the icon
   */
  getIconMesh() {
    // Use the fallback system for robust icon generation
    return this.getIconMeshWithFallback();
  }

  /**
   * Validates geometry for manifold properties and basic integrity
   * @param {THREE.BufferGeometry} geometry - The geometry to validate
   * @return {Object} - Validation result with isValid flag and issues array
   */
  validateGeometry(geometry) {
    const result = {
      isValid: true,
      issues: [],
      isManifold: true,
      hasValidNormals: true,
      hasValidPositions: true
    };

    // Check if geometry has position attribute
    if (!geometry.attributes.position) {
      result.isValid = false;
      result.hasValidPositions = false;
      result.issues.push('Geometry missing position attribute');
      return result;
    }

    const positions = geometry.attributes.position;
    const positionCount = positions.count;

    // Check for valid position count (must be multiple of 3 for triangles)
    if (positionCount === 0) {
      result.isValid = false;
      result.hasValidPositions = false;
      result.issues.push('Geometry has no vertices');
      return result;
    }

    if (positionCount % 3 !== 0) {
      result.isValid = false;
      result.hasValidPositions = false;
      result.issues.push('Vertex count is not multiple of 3 (invalid triangulation)');
    }

    // Check for NaN or infinite values in positions
    const posArray = positions.array;
    for (let i = 0; i < posArray.length; i++) {
      if (!isFinite(posArray[i])) {
        result.isValid = false;
        result.hasValidPositions = false;
        result.issues.push('Geometry contains NaN or infinite position values');
        break;
      }
    }

    // Check normals if they exist
    if (geometry.attributes.normal) {
      const normals = geometry.attributes.normal;
      const normalArray = normals.array;

      for (let i = 0; i < normalArray.length; i++) {
        if (!isFinite(normalArray[i])) {
          result.hasValidNormals = false;
          result.issues.push('Geometry contains invalid normal values');
          break;
        }
      }
    }

    // Basic manifold check: look for degenerate triangles
    const vertices = [];
    for (let i = 0; i < positionCount; i += 3) {
      const triangle = [
        new THREE.Vector3(posArray[i * 3], posArray[i * 3 + 1], posArray[i * 3 + 2]),
        new THREE.Vector3(posArray[(i + 1) * 3], posArray[(i + 1) * 3 + 1], posArray[(i + 1) * 3 + 2]),
        new THREE.Vector3(posArray[(i + 2) * 3], posArray[(i + 2) * 3 + 1], posArray[(i + 2) * 3 + 2])
      ];

      // Check for degenerate triangles (zero area)
      const edge1 = triangle[1].clone().sub(triangle[0]);
      const edge2 = triangle[2].clone().sub(triangle[0]);
      const cross = edge1.cross(edge2);

      if (cross.length() < 1e-10) {
        result.isManifold = false;
        result.issues.push('Geometry contains degenerate triangles');
        break;
      }
    }

    // Update overall validity
    result.isValid = result.hasValidPositions && result.hasValidNormals && result.isManifold;

    return result;
  }

  /**
   * Attempts to repair basic geometry issues
   * @param {THREE.BufferGeometry} geometry - The geometry to repair
   * @return {THREE.BufferGeometry} - The repaired geometry
   */
  repairGeometry(geometry) {
    let repairedGeometry = geometry.clone();

    // Ensure non-indexed
    if (repairedGeometry.index !== null) {
      repairedGeometry = repairedGeometry.toNonIndexed();
    }

    // Compute normals if missing or invalid
    if (!repairedGeometry.attributes.normal) {
      repairedGeometry.computeVertexNormals();
    }

    // Remove degenerate triangles
    const positions = repairedGeometry.attributes.position;
    const normals = repairedGeometry.attributes.normal;
    const posArray = positions.array;
    const normArray = normals ? normals.array : null;

    const validVertices = [];
    const validNormals = [];

    for (let i = 0; i < positions.count; i += 3) {
      const v1 = new THREE.Vector3(posArray[i * 3], posArray[i * 3 + 1], posArray[i * 3 + 2]);
      const v2 = new THREE.Vector3(posArray[(i + 1) * 3], posArray[(i + 1) * 3 + 1], posArray[(i + 1) * 3 + 2]);
      const v3 = new THREE.Vector3(posArray[(i + 2) * 3], posArray[(i + 2) * 3 + 1], posArray[(i + 2) * 3 + 2]);

      // Check triangle area
      const edge1 = v2.clone().sub(v1);
      const edge2 = v3.clone().sub(v1);
      const cross = edge1.cross(edge2);

      if (cross.length() > 1e-10) {
        // Valid triangle, keep it
        validVertices.push(v1.x, v1.y, v1.z, v2.x, v2.y, v2.z, v3.x, v3.y, v3.z);

        if (normArray) {
          validNormals.push(
            normArray[i * 3], normArray[i * 3 + 1], normArray[i * 3 + 2],
            normArray[(i + 1) * 3], normArray[(i + 1) * 3 + 1], normArray[(i + 1) * 3 + 2],
            normArray[(i + 2) * 3], normArray[(i + 2) * 3 + 1], normArray[(i + 2) * 3 + 2]
          );
        }
      }
    }

    // Create new geometry with valid triangles
    const cleanGeometry = new THREE.BufferGeometry();
    cleanGeometry.setAttribute('position', new THREE.Float32BufferAttribute(validVertices, 3));

    if (validNormals.length > 0) {
      cleanGeometry.setAttribute('normal', new THREE.Float32BufferAttribute(validNormals, 3));
    } else {
      cleanGeometry.computeVertexNormals();
    }

    return cleanGeometry;
  }

  /**
   * Implements graceful fallback chain for icon processing
   * @return {THREE.Mesh|null} - The icon mesh or null if all fallbacks fail
   */
  getIconMeshWithFallback() {
    // Reset status tracking
    this.iconCompatibilityStatus = {
      isCompatibilityMode: this.options.code.compatibilityMode,
      wasSimplified: false,
      fallbackLevel: 0,
      hasHoles: false,
      holesRemoved: false
    };

    const fallbackChain = [
      () => this.tryComplexIconProcessing(),
      () => this.trySimplifiedIconProcessing(),
      () => this.tryNoHolesIconProcessing(),
      () => this.tryBasicShapeIconProcessing()
    ];

    for (let i = 0; i < fallbackChain.length; i++) {
      try {
        const result = fallbackChain[i]();
        if (result && this.validateIconMesh(result)) {
          // Update status tracking
          this.iconCompatibilityStatus.fallbackLevel = i;
          if (i > 0) {
            this.iconCompatibilityStatus.wasSimplified = true;
            console.warn(`Icon processing succeeded with fallback level ${i + 1}`);
          }
          return result;
        }
      } catch (error) {
        console.warn(`Icon processing fallback level ${i + 1} failed:`, error);
      }
    }

    console.error('All icon processing fallbacks failed, disabling icon');
    return null;
  }

  /**
   * Validates an icon mesh for basic integrity
   * @param {THREE.Mesh} mesh - The mesh to validate
   * @return {boolean} - True if mesh is valid
   */
  validateIconMesh(mesh) {
    if (!mesh || !mesh.geometry) {
      return false;
    }

    const validation = this.validateGeometry(mesh.geometry);
    if (!validation.isValid) {
      console.warn('Icon mesh validation failed:', validation.issues);
      return false;
    }

    // Check if mesh has reasonable bounds
    const boundingBox = new THREE.Box3().setFromObject(mesh);
    const size = boundingBox.getSize(new THREE.Vector3());

    if (size.x === 0 || size.y === 0 || size.z === 0) {
      console.warn('Icon mesh has zero dimensions');
      return false;
    }

    return true;
  }

  /**
   * Attempts complex icon processing (current enhanced mode)
   * @return {THREE.Mesh|null} - The icon mesh or null if failed
   */
  tryComplexIconProcessing() {
    if (this.options.code.compatibilityMode) {
      return this.getCompatibleIconMesh();
    }
    return this.getEnhancedIconMesh();
  }

  /**
   * Attempts simplified icon processing with reduced complexity
   * @return {THREE.Mesh|null} - The icon mesh or null if failed
   */
  trySimplifiedIconProcessing() {
    const geometries = [];

    if (!this.options.code.iconShapes || this.options.code.iconShapes.length === 0) {
      return null;
    }

    this.options.code.iconShapes.forEach((shapeData) => {
      try {
        let shape;

        // Handle shape format but ignore holes for simplified processing
        if (shapeData.shape && shapeData.holes !== undefined) {
          shape = new THREE.Shape().fromJSON(shapeData.shape);
          // Intentionally ignore holes for simplified processing
        } else {
          shape = new THREE.Shape().fromJSON(shapeData);
        }

        // Simplify the shape
        const simplifiedShape = this.simplifyShapeForCompatibility(shape);

        // Create geometry with conservative settings
        const pathGeometry = new THREE.ExtrudeGeometry(simplifiedShape, {
          steps: 1,
          depth: this.options.code.depth,
          bevelEnabled: false,
          curveSegments: 6, // Reduced complexity
        });

        // Validate and repair geometry
        const validation = this.validateGeometry(pathGeometry);
        let finalGeometry = pathGeometry;

        if (!validation.isValid) {
          console.warn('Repairing geometry in simplified processing');
          finalGeometry = this.repairGeometry(pathGeometry);
        }

        // Don't apply transformations here - let createFinalIconMesh handle positioning
        geometries.push(finalGeometry);
      } catch (shapeError) {
        console.warn('Error in simplified shape processing:', shapeError);
      }
    });

    if (geometries.length === 0) {
      return null;
    }

    return this.createFinalIconMesh(geometries);
  }

  /**
   * Attempts icon processing without holes
   * @return {THREE.Mesh|null} - The icon mesh or null if failed
   */
  tryNoHolesIconProcessing() {
    const geometries = [];

    if (!this.options.code.iconShapes || this.options.code.iconShapes.length === 0) {
      return null;
    }

    this.options.code.iconShapes.forEach((shapeData) => {
      try {
        let shape;

        // Extract only the main shape, completely ignore holes
        if (shapeData.shape) {
          shape = new THREE.Shape().fromJSON(shapeData.shape);
        } else {
          shape = new THREE.Shape().fromJSON(shapeData);
        }

        // Use basic extrude geometry without any complexity
        const pathGeometry = new THREE.ExtrudeGeometry(shape, {
          steps: 1,
          depth: this.options.code.depth,
          bevelEnabled: false,
          curveSegments: 4, // Minimal curve segments
        });

        // Ensure geometry is valid
        const repairedGeometry = this.repairGeometry(pathGeometry);

        // Don't apply transformations here - let createFinalIconMesh handle positioning
        geometries.push(repairedGeometry);
      } catch (shapeError) {
        console.warn('Error in no-holes shape processing:', shapeError);
      }
    });

    if (geometries.length === 0) {
      return null;
    }

    return this.createFinalIconMesh(geometries);
  }

  /**
   * Attempts basic shape icon processing as final fallback
   * @return {THREE.Mesh|null} - The icon mesh or null if failed
   */
  tryBasicShapeIconProcessing() {
    try {
      // Create a simple rectangular icon as absolute fallback
      const fallbackShape = new THREE.Shape();
      const size = this.availableWidth * (this.options.code.iconSizeRatio / 100) * 0.3;

      fallbackShape.moveTo(-size / 2, -size / 2);
      fallbackShape.lineTo(size / 2, -size / 2);
      fallbackShape.lineTo(size / 2, size / 2);
      fallbackShape.lineTo(-size / 2, size / 2);
      fallbackShape.lineTo(-size / 2, -size / 2);

      const pathGeometry = new THREE.ExtrudeGeometry(fallbackShape, {
        steps: 1,
        depth: this.options.code.depth,
        bevelEnabled: false,
      });

      const repairedGeometry = this.repairGeometry(pathGeometry);

      // Don't apply transformations here - let createFinalIconMesh handle positioning
      return this.createFinalIconMesh([repairedGeometry]);
    } catch (error) {
      console.error('Even basic shape processing failed:', error);
      return null;
    }
  }

  /**
   * Creates the final icon mesh from processed geometries
   * @param {THREE.BufferGeometry[]} geometries - Array of processed geometries
   * @return {THREE.Mesh|null} - The final icon mesh
   */
  createFinalIconMesh(geometries) {
    try {
      // Ensure all geometries are non-indexed for compatibility
      const compatibleGeometries = geometries.map(geo => {
        if (geo.index !== null) {
          return geo.toNonIndexed();
        }
        return geo;
      });

      // Validate all geometries before merging
      const validGeometries = compatibleGeometries.filter(geo => {
        const validation = this.validateGeometry(geo);
        if (!validation.isValid) {
          console.warn('Filtering out invalid geometry:', validation.issues);
          return false;
        }
        return true;
      });

      if (validGeometries.length === 0) {
        console.warn('No valid geometries remaining after validation');
        return null;
      }

      const iconGeometry = validGeometries.length === 1
        ? validGeometries[0]
        : BufferGeometryUtils.mergeGeometries(validGeometries);

      const iconMesh = new THREE.Mesh(iconGeometry, this.materialDetail);

      // Apply the correct rotation for icon orientation
      iconMesh.rotation.set(Math.PI, 0, -Math.PI / 2);

      // Apply scaling and positioning
      let iconSize = getBoundingBoxSize(iconMesh);

      const iconSizeRatio = this.options.code.iconSizeRatio / 100;
      const scaleRatioY = iconSize.y / (this.availableWidth * iconSizeRatio);
      const scaleRatioX = iconSize.x / (this.availableWidth * iconSizeRatio);

      const scaleRatio = scaleRatioX > scaleRatioY ? scaleRatioX : scaleRatioY;
      iconMesh.scale.x /= scaleRatio;
      iconMesh.scale.y /= scaleRatio;

      // Recalculate size after scaling
      iconSize = getBoundingBoxSize(iconMesh);

      // Calculate the visual center of the mesh for better positioning
      const boundingBox = new THREE.Box3().setFromObject(iconMesh);
      const center = boundingBox.getCenter(new THREE.Vector3());
      
      // Position the icon so its visual center aligns with the QR code center
      iconMesh.position.x = -center.x;
      iconMesh.position.y = -center.y;
      iconMesh.position.z = this.options.base.depth + this.options.code.depth;
      iconMesh.updateMatrix();

      return iconMesh;
    } catch (error) {
      console.error('Error creating final icon mesh:', error);
      return null;
    }
  }

  /**
   * @return {THREE.Mesh} the 3D mesh of the icon using enhanced processing with full features
   */
  getEnhancedIconMesh() {
    const geometries = [];

    if (!this.options.code.iconShapes || this.options.code.iconShapes.length === 0) {
      console.warn('No icon shapes available for 3D generation');
      return null;
    }

    try {
      // Handle shape format with proper hole support (r127+)
      this.options.code.iconShapes.forEach((shapeData) => {
        try {
          let shape, holes = [];

          // Handle new format with holes
          if (shapeData.shape && shapeData.holes !== undefined) {
            shape = new THREE.Shape().fromJSON(shapeData.shape);
            holes = shapeData.holes.map(holeData => new THREE.Path().fromJSON(holeData));
          } else {
            // Fallback for simple format
            shape = new THREE.Shape().fromJSON(shapeData);
          }

          // Set holes if any
          if (holes.length > 0) {
            shape.holes = holes;
          }

          // Finally we can take each shape and extrude it
          const pathGeometry = new THREE.ExtrudeGeometry(shape, {
            steps: 1,
            depth: this.options.code.depth,
            bevelEnabled: false,
          });

          // Validate geometry before proceeding
          const validation = this.validateGeometry(pathGeometry);
          let finalGeometry = pathGeometry;

          if (!validation.isValid) {
            console.warn('Geometry validation failed, attempting repair:', validation.issues);
            finalGeometry = this.repairGeometry(pathGeometry);

            // Re-validate after repair
            const repairedValidation = this.validateGeometry(finalGeometry);
            if (!repairedValidation.isValid) {
              console.warn('Geometry repair failed, skipping shape:', repairedValidation.issues);
              return; // Skip this shape
            }
          }

          // Don't apply transformations here - let createFinalIconMesh handle positioning
          geometries.push(finalGeometry);
        } catch (shapeError) {
          console.warn('Error processing individual shape:', shapeError);
          // Continue with other shapes
        }
      });
    } catch (error) {
      console.error('Error creating icon shapes:', error);
      throw error; // Re-throw to trigger fallback
    }

    if (geometries.length === 0) {
      throw new Error('No valid geometries generated from icon shapes');
    }

    return this.createFinalIconMesh(geometries);
  }

  /**
   * @return {THREE.Mesh} the 3D mesh of the icon using TinkerCAD-compatible processing
   */
  getCompatibleIconMesh() {
    const mainGeometries = [];
    const holeGeometries = [];

    if (!this.options.code.iconShapes || this.options.code.iconShapes.length === 0) {
      console.warn('No icon shapes available for 3D generation');
      return null;
    }

    try {
      // Process each shape with TinkerCAD compatibility in mind
      this.options.code.iconShapes.forEach((shapeData) => {
        try {
          let shape, holes = [];

          // Handle shape format - separate main shapes from holes for compatibility
          if (shapeData.shape && shapeData.holes !== undefined) {
            shape = new THREE.Shape().fromJSON(shapeData.shape);
            holes = shapeData.holes.map(holeData => new THREE.Path().fromJSON(holeData));
          } else {
            // Fallback for simple format
            shape = new THREE.Shape().fromJSON(shapeData);
          }

          // Process main shape
          const simplifiedShape = this.simplifyShapeForCompatibility(shape);
          const mainGeometry = this.createCompatibleShapeGeometry(simplifiedShape);
          if (mainGeometry) {
            // Validate geometry before adding
            const validation = this.validateGeometry(mainGeometry);
            if (validation.isValid) {
              mainGeometries.push(mainGeometry);
            } else {
              console.warn('Main geometry validation failed, attempting repair:', validation.issues);
              const repairedGeometry = this.repairGeometry(mainGeometry);
              const repairedValidation = this.validateGeometry(repairedGeometry);
              if (repairedValidation.isValid) {
                mainGeometries.push(repairedGeometry);
              } else {
                console.warn('Main geometry repair failed, skipping shape');
              }
            }
          }

          // Process holes separately for CSG subtraction
          if (holes.length > 0) {
            this.iconCompatibilityStatus.hasHoles = true;
            holes.forEach((holePath) => {
              try {
                const holeShape = new THREE.Shape(holePath.getPoints());
                const simplifiedHoleShape = this.simplifyShapeForCompatibility(holeShape);
                const holeGeometry = this.createCompatibleShapeGeometry(simplifiedHoleShape);
                if (holeGeometry) {
                  // Validate hole geometry
                  const holeValidation = this.validateGeometry(holeGeometry);
                  if (holeValidation.isValid) {
                    holeGeometries.push(holeGeometry);
                  } else {
                    console.warn('Hole geometry validation failed, skipping hole:', holeValidation.issues);
                    this.iconCompatibilityStatus.holesRemoved = true;
                  }
                } else {
                  this.iconCompatibilityStatus.holesRemoved = true;
                }
              } catch (holeError) {
                console.warn('Error processing hole in compatibility mode:', holeError);
                this.iconCompatibilityStatus.holesRemoved = true;
                // Continue with other holes
              }
            });
          }
        } catch (shapeError) {
          console.warn('Error processing individual shape in compatibility mode:', shapeError);
          // Continue with other shapes
        }
      });
    } catch (error) {
      console.error('Error creating compatible icon shapes:', error);
      throw error; // Re-throw to trigger fallback
    }

    if (mainGeometries.length === 0) {
      throw new Error('No compatible geometries generated for icon');
    }

    // Create main icon mesh from merged main geometries
    const mainIconGeometry = this.mergeGeometriesCompatibly(mainGeometries);
    let iconMesh = new THREE.Mesh(mainIconGeometry, this.materialDetail);

    // Validate the merged geometry
    const mergedValidation = this.validateGeometry(mainIconGeometry);
    if (!mergedValidation.isValid) {
      console.warn('Merged geometry validation failed:', mergedValidation.issues);
      const repairedMergedGeometry = this.repairGeometry(mainIconGeometry);
      iconMesh = new THREE.Mesh(repairedMergedGeometry, this.materialDetail);
    }

    // Apply holes using CSG subtraction if available and holes exist
    if (holeGeometries.length > 0) {
      try {
        iconMesh = this.applyHolesWithCSG(iconMesh, holeGeometries);

        // Validate the final mesh after CSG operations
        const finalValidation = this.validateGeometry(iconMesh.geometry);
        if (!finalValidation.isValid) {
          console.warn('CSG result validation failed, using mesh without holes:', finalValidation.issues);
          // Recreate mesh without holes
          iconMesh = new THREE.Mesh(mainIconGeometry, this.materialDetail);
        }
      } catch (csgError) {
        console.warn('CSG hole processing failed completely:', csgError);
        // Continue with main mesh without holes
      }
    }

    // Apply scaling and positioning (same as enhanced mode)
    let iconSize = getBoundingBoxSize(iconMesh);

    const iconSizeRatio = this.options.code.iconSizeRatio / 100;
    const scaleRatioY = iconSize.y / (this.availableWidth * iconSizeRatio);
    const scaleRatioX = iconSize.x / (this.availableWidth * iconSizeRatio);

    const scaleRatio = scaleRatioX > scaleRatioY ? scaleRatioX : scaleRatioY;
    iconMesh.scale.x /= scaleRatio;
    iconMesh.scale.y /= scaleRatio;
    iconMesh.rotation.x = Math.PI;

    // Move icon to center
    iconSize = getBoundingBoxSize(iconMesh);

    iconMesh.position.x = -iconSize.x / 2;
    iconMesh.position.y = -iconSize.y / 2;
    iconMesh.position.z = this.options.base.depth + this.options.code.depth;
    iconMesh.updateMatrix();

    return iconMesh;
  }

  /**
   * Simplifies a THREE.Shape for TinkerCAD compatibility by reducing curve complexity
   * @param {THREE.Shape} shape - The original shape to simplify
   * @return {THREE.Shape} - The simplified shape
   */
  simplifyShapeForCompatibility(shape) {
    // Create a new simplified shape
    const simplifiedShape = new THREE.Shape();

    // Get the shape's points and simplify curves
    const points = shape.getPoints(8); // Use fewer segments for curves

    if (points.length === 0) {
      console.warn('Shape has no points, returning empty shape');
      return simplifiedShape;
    }

    // Start with the first point
    simplifiedShape.moveTo(points[0].x, points[0].y);

    // Add remaining points with line segments (avoiding complex curves)
    for (let i = 1; i < points.length; i++) {
      simplifiedShape.lineTo(points[i].x, points[i].y);
    }

    // Close the shape if it's not already closed
    if (points.length > 2) {
      const firstPoint = points[0];
      const lastPoint = points[points.length - 1];
      const distance = firstPoint.distanceTo(lastPoint);

      if (distance > 0.001) { // Small threshold for floating point comparison
        simplifiedShape.lineTo(firstPoint.x, firstPoint.y);
      }
    }

    return simplifiedShape;
  }

  /**
   * Ensures geometry is compatible with TinkerCAD by making it non-indexed and manifold
   * @param {THREE.BufferGeometry} geometry - The geometry to make compatible
   * @return {THREE.BufferGeometry} - The compatible geometry
   */
  ensureCompatibleGeometry(geometry) {
    let compatibleGeometry = geometry;

    // Ensure geometry is non-indexed
    if (compatibleGeometry.index !== null) {
      compatibleGeometry = compatibleGeometry.toNonIndexed();
    }

    // Compute normals if they don't exist
    if (!compatibleGeometry.attributes.normal) {
      compatibleGeometry.computeVertexNormals();
    }

    // Validate that geometry has the required attributes
    if (!compatibleGeometry.attributes.position) {
      console.error('Geometry missing position attribute');
      return new THREE.BufferGeometry(); // Return empty geometry as fallback
    }

    return compatibleGeometry;
  }

  /**
   * Merges geometries with TinkerCAD compatibility considerations
   * @param {THREE.BufferGeometry[]} geometries - Array of geometries to merge
   * @return {THREE.BufferGeometry} - The merged compatible geometry
   */
  mergeGeometriesCompatibly(geometries) {
    // Ensure all geometries are compatible before merging
    const compatibleGeometries = geometries.map(geo => this.ensureCompatibleGeometry(geo));

    // Filter out any empty geometries
    const validGeometries = compatibleGeometries.filter(geo => {
      return geo.attributes.position && geo.attributes.position.count > 0;
    });

    if (validGeometries.length === 0) {
      console.warn('No valid geometries to merge');
      return new THREE.BufferGeometry();
    }

    if (validGeometries.length === 1) {
      return validGeometries[0];
    }

    try {
      const mergedGeometry = BufferGeometryUtils.mergeGeometries(validGeometries);
      return this.ensureCompatibleGeometry(mergedGeometry);
    } catch (error) {
      console.error('Error merging geometries in compatibility mode:', error);
      // Fallback: return the first valid geometry
      return validGeometries[0];
    }
  }

  /**
   * Creates a compatible geometry from a shape for TinkerCAD compatibility
   * @param {THREE.Shape} shape - The shape to create geometry from
   * @return {THREE.BufferGeometry|null} - The compatible geometry or null if failed
   */
  createCompatibleShapeGeometry(shape) {
    try {
      // Create extrude geometry with conservative settings
      const pathGeometry = new THREE.ExtrudeGeometry(shape, {
        steps: 1,
        depth: this.options.code.depth,
        bevelEnabled: false,
        // Use conservative settings for TinkerCAD compatibility
        curveSegments: 8, // Reduce curve complexity
      });

      // Ensure geometry is non-indexed and manifold
      const compatibleGeometry = this.ensureCompatibleGeometry(pathGeometry);

      // Apply transformation matrix
      const pathMesh = new THREE.Mesh(compatibleGeometry, this.materialDetail);
      pathMesh.position.set(0, 0, 0);
      pathMesh.rotation.set(0, 0, -Math.PI / 2);
      pathMesh.updateMatrix();

      const clonedGeometry = compatibleGeometry.clone();
      clonedGeometry.applyMatrix4(pathMesh.matrix);

      return clonedGeometry;
    } catch (error) {
      console.warn('Error creating compatible shape geometry:', error);
      return null;
    }
  }

  /**
   * Applies holes to the main icon mesh using CSG subtraction with fallback
   * @param {THREE.Mesh} mainMesh - The main icon mesh
   * @param {THREE.BufferGeometry[]} holeGeometries - Array of hole geometries
   * @return {THREE.Mesh} - The mesh with holes applied or original mesh if CSG fails
   */
  applyHolesWithCSG(mainMesh, holeGeometries) {
    try {
      // Convert main mesh to CSG
      let mainCSG = CSG.fromMesh(mainMesh);

      // Apply each hole using CSG subtraction
      holeGeometries.forEach((holeGeometry, index) => {
        try {
          const holeMesh = new THREE.Mesh(holeGeometry, this.materialDetail);
          const holeCSG = CSG.fromMesh(holeMesh);
          mainCSG = mainCSG.subtract(holeCSG);
        } catch (holeError) {
          console.warn(`Error applying hole ${index} with CSG, skipping:`, holeError);
          // Continue with other holes
        }
      });

      // Convert back to mesh
      const resultMesh = CSG.toMesh(mainCSG, mainMesh.matrix);
      resultMesh.material = this.materialDetail;

      // Ensure the resulting geometry is compatible
      if (resultMesh.geometry.index !== null) {
        resultMesh.geometry = resultMesh.geometry.toNonIndexed();
      }

      return resultMesh;
    } catch (csgError) {
      console.warn('CSG hole processing failed, falling back to main shape without holes:', csgError);
      // Fallback: return the original mesh without holes
      return mainMesh;
    }
  }

  /**
   * @return {THREE.Mesh} the mesh of the actual QR-Code segment
   */
  getQRCodeMesh() {
    const invert = this.options.code.invert;
    const useOldCompatMode = this.options.code.compatibilityMode;
    const iconSize = this.iconMesh ? getBoundingBoxSize(this.iconMesh) : null;
    // fast path for non-inverted QR codes or when using compatibility mode (avoid CSG)
    if (!invert || useOldCompatMode) {
      // Warn user if inversion is requested but compatibility mode is enabled
      if (invert && useOldCompatMode) {
        console.warn('TinkerCAD compatibility mode: QR code inversion disabled to avoid geometry errors');
      }
      const geometries = [];
      for (let y = 0; y < this.maskWidth; y += 1) {
        for (let x = 0; x < this.maskWidth; x += 1) {
          if (!this.bitMask[x * this.maskWidth + y]) continue;
          let blockDepth = this.options.code.depth;
          if (this.options.code.cityMode) {
            blockDepth = Math.min(this.options.code.depth, this.options.code.depthMax)
              + Math.random() * Math.abs(this.options.code.depthMax - this.options.code.depth);
          }
          const blockGeo = new THREE.BoxGeometry(this.blockWidth, this.blockWidth, blockDepth);
          const blockMesh = new THREE.Mesh(blockGeo, this.materialDetail);
          const blockX = (x / this.maskWidth) * this.availableWidth - this.availableWidth / 2 + this.blockWidth / 2;
          const blockY = (y / this.maskWidth) * this.availableWidth - this.availableWidth / 2 + this.blockWidth / 2;
          if (this.iconMesh) {
            const margin = Math.min(this.blockWidth * 1.5, 4);
            if (blockX > -iconSize.x / 2 - margin && blockX < iconSize.x / 2 + margin
              && blockY > -iconSize.y / 2 - margin && blockY < iconSize.y / 2 + margin) {
              continue;
            }
          }
          blockMesh.position.set(blockX, blockY, this.options.base.depth + blockDepth / 2);
          blockMesh.updateMatrix();
          const clonedBlockGeometry = blockGeo.clone();
          clonedBlockGeometry.applyMatrix4(blockMesh.matrix);
          geometries.push(clonedBlockGeometry);
        }
      }
      if (geometries.length === 0) {
        return new THREE.Mesh(new THREE.BufferGeometry(), this.materialDetail);
      }

      // Ensure all geometries are non-indexed for compatibility
      const compatibleGeometries = geometries.map(geo => {
        if (geo.index !== null) {
          return geo.toNonIndexed();
        }
        return geo;
      });

      const qrcodeGeometry = BufferGeometryUtils.mergeGeometries(compatibleGeometries);
      return new THREE.Mesh(qrcodeGeometry, this.materialDetail);
    }

  // slow path for inverted QR codes
  // Initialize CSG only when we have the first valid block to avoid empty geometry issues
  let bspQRMesh = null;
    // iterate through pixels in QR Code Bitmask
    for (let y = 0; y < this.maskWidth; y += 1) {
      for (let x = 0; x < this.maskWidth; x += 1) {
        const isBlack = !!this.bitMask[x * this.maskWidth + y];
        if (isBlack) {
          // if pixel is black create a block
          let blockDepth = this.options.code.depth;
          if (this.options.code.cityMode) {
            blockDepth = Math.min(this.options.code.depth, this.options.code.depthMax) + Math.random() * Math.abs(this.options.code.depthMax - this.options.code.depth);
          }

          const qrBlock = new THREE.BoxGeometry(
            this.blockWidth,
            this.blockWidth,
            blockDepth,
          );

          const qrBlockMesh = new THREE.Mesh(qrBlock, this.materialDetail);

          // qr code block positions
          let blockX = (x / this.maskWidth) * this.availableWidth;
          blockX -= this.availableWidth / 2;
          blockX += this.blockWidth / 2;

          let blockY = (y / this.maskWidth) * this.availableWidth;
          blockY -= this.availableWidth / 2;
          blockY += this.blockWidth / 2;

          if (this.iconMesh) {
            // don't draw block if it collides with icon bounding box
            const safetyMargin = Math.min(this.blockWidth * 1.5, 4);
            if ((blockX > -iconSize.x / 2 - safetyMargin
              && blockX < iconSize.x / 2 + safetyMargin)
              && (blockY > -iconSize.y / 2 - safetyMargin
              && blockY < +iconSize.y / 2 + safetyMargin)) {
              // eslint-disable-next-line no-continue
              continue;
            }
          }

          const blockZ = this.options.base.depth + blockDepth / 2;
          qrBlockMesh.position.set(blockX, blockY, blockZ);

          // add qr code blocks to qrcode and combined model
          qrBlockMesh.updateMatrix();
          const bspBlockMesh = CSG.fromMesh(qrBlockMesh);
          if (bspQRMesh) {
            bspQRMesh = bspQRMesh.union(bspBlockMesh);
          } else {
            // First block initializes the CSG tree
            bspQRMesh = bspBlockMesh;
          }
          // qrcodeGeometry.merge(qrBlockMesh.geometry, qrBlockMesh.matrix);
        }
      }
    }
    // If no blocks were added (edge case), build and return just the inner area mesh
    if (!bspQRMesh) {
      const cornerRadius = this.getCornerRadius();
      const textBaseOffset = this.getTextBaseOffset();
      const topOffset = this.getTextTopOffset();
      const leftOffset = this.getTextLeftOffset();
      const isOffsetTopBottom = this.options.base.textPlacement === 'top' || this.options.base.textPlacement === 'bottom' || this.options.base.textPlacement === 'center';
      const isOffsetLeftRight = this.options.base.textPlacement === 'left' || this.options.base.textPlacement === 'right';

      let innerAreaShape;
      if (isOffsetTopBottom) {
        innerAreaShape = getRoundedRectShape(
          -(this.options.base.height + topOffset - this.options.base.borderWidth * 2) / 2,
          -(this.options.base.width - this.options.base.borderWidth * 2) / 2,
          this.options.base.height + textBaseOffset - this.options.base.borderWidth * 2,
          this.options.base.width - this.options.base.borderWidth * 2,
          Math.max(0, cornerRadius - this.options.base.borderWidth),
        );
      } else if (isOffsetLeftRight) {
        innerAreaShape = getRoundedRectShape(
          -(this.options.base.height - this.options.base.borderWidth * 2) / 2,
          -(this.options.base.width + leftOffset - this.options.base.borderWidth * 2) / 2,
          this.options.base.height - this.options.base.borderWidth * 2,
          this.options.base.width + textBaseOffset - this.options.base.borderWidth * 2,
          Math.max(0, cornerRadius - this.options.base.borderWidth),
        );
      }

      const innerAreaMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(innerAreaShape, {
        steps: 1,
        depth: this.options.code.depth,
        bevelEnabled: false,
      }), this.materialDetail);
      innerAreaMesh.position.z = this.options.base.depth;
      innerAreaMesh.updateMatrix();
      return innerAreaMesh;
    }

    const finalBlockMesh = CSG.toMesh(bspQRMesh, new THREE.Matrix4());
    finalBlockMesh.material = this.materialDetail;

    if (this.options.code.invert) {
      const cornerRadius = this.getCornerRadius();
      const textBaseOffset = this.getTextBaseOffset();
      const topOffset = this.getTextTopOffset();
      const leftOffset = this.getTextLeftOffset();
      const isOffsetTopBottom = this.options.base.textPlacement === 'top' || this.options.base.textPlacement === 'bottom' || this.options.base.textPlacement === 'center';
      const isOffsetLeftRight = this.options.base.textPlacement === 'left' || this.options.base.textPlacement === 'right';

      // const innerAreaShape = getRoundedRectShape(
      //   -(this.options.base.width + topOffset - this.options.base.borderWidth * 2) / 2,
      //   -(this.options.base.width - this.options.base.borderWidth * 2) / 2,
      //   this.options.base.width + textBaseOffset - this.options.base.borderWidth * 2,
      //   this.options.base.width - this.options.base.borderWidth * 2,
      //   Math.max(0, cornerRadius - this.options.base.borderWidth),
      // );
      let innerAreaShape;
      if (isOffsetTopBottom) {
        innerAreaShape = getRoundedRectShape(
          -(this.options.base.height + topOffset - this.options.base.borderWidth * 2) / 2,
          -(this.options.base.width - this.options.base.borderWidth * 2) / 2,
          this.options.base.height + textBaseOffset - this.options.base.borderWidth * 2,
          this.options.base.width - this.options.base.borderWidth * 2,
          Math.max(0, cornerRadius - this.options.base.borderWidth),
        );
      } else if (isOffsetLeftRight) {
        innerAreaShape = getRoundedRectShape(
          -(this.options.base.height - this.options.base.borderWidth * 2) / 2,
          -(this.options.base.width + leftOffset - this.options.base.borderWidth * 2) / 2,
          this.options.base.height - this.options.base.borderWidth * 2,
          this.options.base.width + textBaseOffset - this.options.base.borderWidth * 2,
          Math.max(0, cornerRadius - this.options.base.borderWidth),
        );
      }

      const innerAreaMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(innerAreaShape, {
        steps: 1,
        depth: this.options.code.depth,
        bevelEnabled: false,
      }), this.materialDetail);
      innerAreaMesh.position.z = 0;
      innerAreaMesh.updateMatrix();

      finalBlockMesh.position.z = -this.options.base.depth;
      finalBlockMesh.updateMatrix();

      const invertedMesh = subtractMesh(innerAreaMesh, finalBlockMesh);
      invertedMesh.position.z = this.options.base.depth;
      invertedMesh.updateMatrix();
      return invertedMesh;
    }

    return finalBlockMesh;
  }

  /**
   * Returns one merged mesh of all part meshes
   */
  getCombinedMesh() {
    const baseCombined = super.getCombinedMesh();
    const geometries = [baseCombined.geometry.clone()];

    if (this.qrcodeMesh) {
      const qrcodeGeo = this.qrcodeMesh.geometry.clone();
      qrcodeGeo.applyMatrix4(this.qrcodeMesh.matrix);
      geometries.push(qrcodeGeo);
    }

    if (this.iconMesh && !this.options.code.invert) {
      const iconGeo = this.iconMesh.geometry.clone();
      iconGeo.applyMatrix4(this.iconMesh.matrix);
      geometries.push(iconGeo);
    }

    // Ensure all geometries are non-indexed for compatibility
    const compatibleGeometries = geometries.map(geo => {
      if (geo.index !== null) {
        return geo.toNonIndexed();
      }
      return geo;
    });

    const combinedGeometry = BufferGeometryUtils.mergeGeometries(compatibleGeometries);
    this.combinedMesh = new THREE.Mesh(combinedGeometry, this.materialBase);
    return this.combinedMesh;
  }

  /**
   * Generates all required meshes of the 3D model and combines them
   */
  async generate3dModel() {
    super.generate3dModel();

    if (this.options.code.iconName !== 'none') {
      try {
        this.iconMesh = this.getIconMesh();

        // If icon generation failed, reset to no icon and provide user feedback
        if (!this.iconMesh) {
          console.error('Icon mesh generation failed completely, disabling icon');
          this.options.code.iconName = 'none';

          // Store error information for potential UI feedback
          this.iconGenerationError = {
            type: 'generation_failed',
            message: 'Icon processing failed at all fallback levels',
            timestamp: new Date().toISOString()
          };
        } else {
          // Clear any previous error
          this.iconGenerationError = null;
        }
      } catch (iconError) {
        console.error('Unexpected error during icon generation:', iconError);
        this.iconMesh = null;
        this.options.code.iconName = 'none';

        this.iconGenerationError = {
          type: 'unexpected_error',
          message: iconError.message || 'Unexpected error during icon processing',
          error: iconError,
          timestamp: new Date().toISOString()
        };
      }
    }

    this.qrcodeMesh = this.getQRCodeMesh();

    if (this.options.code.invert) {
      if (this.subtitleMesh) {
        this.qrcodeMesh = subtractMesh(this.qrcodeMesh, this.subtitleMesh);
      }
      if (this.iconMesh) {
        this.qrcodeMesh = subtractMesh(this.qrcodeMesh, this.iconMesh);
      }
    } else if (this.iconMesh) {
      this.exportedMeshes.icon = this.iconMesh;
    }

    this.exportedMeshes.qrcode = this.qrcodeMesh;
    this.exportedMeshes.combined = this.getCombinedMesh();
  }

  /**
   * Gets the current icon generation error information
   * @return {Object|null} - Error information or null if no error
   */
  getIconGenerationError() {
    return this.iconGenerationError || null;
  }

  /**
   * Checks if icon generation encountered any issues
   * @return {boolean} - True if there were icon generation issues
   */
  hasIconGenerationIssues() {
    return this.iconGenerationError !== null;
  }

  /**
   * Gets the current icon compatibility status for UI display
   * @return {Object} - The icon compatibility status object
   */
  getIconCompatibilityStatus() {
    return {
      ...this.iconCompatibilityStatus,
      hasIcon: this.options.code.iconName !== 'none',
      iconName: this.options.code.iconName
    };
  }
}

export default QRCode3D;
