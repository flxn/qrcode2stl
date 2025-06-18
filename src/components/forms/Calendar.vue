<template>
  <div>
    <div class="field has-text-centered">{{$t('optionalFieldsHint')}}</div>

    <!-- Event Name -->
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">{{$t('eventName')}}</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <input
              class="input"
              type="text"
              :placeholder="$t('eventNamePlaceholder')"
              v-model="calendar.eventName"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Start Date -->
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">{{$t('startDate')}}</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <input
              class="input"
              type="date"
              v-model="calendar.startDate"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Start Time -->
    <div class="field is-horizontal" v-if="!calendar.allDay">
      <div class="field-label is-normal">
        <label class="label">{{$t('startTime')}}</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <input
              class="input"
              type="time"
              v-model="calendar.startTime"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- End Date -->
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">{{$t('endDate')}}</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <input
              class="input"
              type="date"
              v-model="calendar.endDate"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- End Time -->
    <div class="field is-horizontal" v-if="!calendar.allDay">
      <div class="field-label is-normal">
        <label class="label">{{$t('endTime')}}</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <input
              class="input"
              type="time"
              v-model="calendar.endTime"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- All Day Toggle -->
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">{{$t('allDay')}}</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <label class="checkbox">
              <input type="checkbox" v-model="calendar.allDay" />
              {{$t('allDayEvent')}}
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Location (optional) -->
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">{{$t('location')}}</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <input
              class="input"
              type="text"
              :placeholder="$t('locationPlaceholder')"
              v-model="calendar.location"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Description (optional) -->
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">{{$t('description')}}</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <textarea
              class="textarea"
              :placeholder="$t('descriptionPlaceholder')"
              v-model="calendar.description"
              style="width: 100%"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CalendarForm',
  props: {
    calendar: Object,
  },
};
</script>

<style>
</style>
