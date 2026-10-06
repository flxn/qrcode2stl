<template>
  <div class="form-stack">
    <p class="field-hint">{{ $t('optionalFieldsHint') }}</p>

    <label class="field-stack" :title="'calendar.eventName — ' + $t('eventName')">
      <span class="field-label">{{ $t('eventName') }}</span>
      <input
        v-model="calendar.eventName"
        class="input"
        type="text"
        :placeholder="$t('eventNamePlaceholder')"
        :title="'calendar.eventName — ' + $t('eventName')"
      />
    </label>

    <div class="field-grid">
      <label class="field-stack" :title="'calendar.startDate — ' + $t('startDate')">
        <span class="field-label">{{ $t('startDate') }}</span>
        <input v-model="calendar.startDate" class="input" type="date" :title="'calendar.startDate — ' + $t('startDate')" />
      </label>
      <label class="field-stack" :title="'calendar.endDate — ' + $t('endDate')">
        <span class="field-label">{{ $t('endDate') }}</span>
        <input v-model="calendar.endDate" class="input" type="date" :title="'calendar.endDate — ' + $t('endDate')" />
      </label>
    </div>

    <UiCollapse :open="!calendar.allDay">
      <div class="field-grid">
        <label class="field-stack" :title="'calendar.startTime — ' + $t('startTime')">
          <span class="field-label">{{ $t('startTime') }}</span>
          <input v-model="calendar.startTime" class="input" type="time" :title="'calendar.startTime — ' + $t('startTime')" />
        </label>
        <label class="field-stack" :title="'calendar.endTime — ' + $t('endTime')">
          <span class="field-label">{{ $t('endTime') }}</span>
          <input v-model="calendar.endTime" class="input" type="time" :title="'calendar.endTime — ' + $t('endTime')" />
        </label>
      </div>
    </UiCollapse>

    <div class="form-inline-row">
      <UiToggle
        v-model="calendar.allDay"
        :label="$t('allDayEvent')"
        :title="'calendar.allDay — ' + $t('allDay')"
      />
    </div>

    <label class="field-stack" :title="'calendar.location — ' + $t('location')">
      <span class="field-label">{{ $t('location') }}</span>
      <input
        v-model="calendar.location"
        class="input"
        type="text"
        :placeholder="$t('locationPlaceholder')"
        :title="'calendar.location — ' + $t('location')"
      />
    </label>

    <label class="field-stack" :title="'calendar.description — ' + $t('description')">
      <span class="field-label">{{ $t('description') }}</span>
      <textarea
        v-model="calendar.description"
        v-autosize
        class="textarea form-textarea"
        rows="2"
        :placeholder="$t('descriptionPlaceholder')"
        :title="'calendar.description — ' + $t('description')"
      ></textarea>
    </label>
  </div>
</template>

<script>
import UiToggle from '../ui/UiToggle.vue';
import UiCollapse from '../ui/UiCollapse.vue';

export default {
  name: 'CalendarForm',
  components: { UiToggle, UiCollapse },
  props: {
    calendar: Object,
  },
};
</script>
