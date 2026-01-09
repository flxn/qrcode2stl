<template>
  <div>
    <div class="field has-text-centered">{{$t('optionalFieldsHint')}}</div>

    <!-- Event Name -->
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label" :title="'calendar.eventName — ' + $t('eventName')">{{$t('eventName')}}</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <input
              class="input"
              type="text"
              :placeholder="$t('eventNamePlaceholder')"
              v-model="calendar.eventName"
              :title="'calendar.eventName — ' + $t('eventName')"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Start Date -->
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label" :title="'calendar.startDate — ' + $t('startDate')">{{$t('startDate')}}</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <input
              class="input"
              type="date"
              v-model="calendar.startDate"
              :title="'calendar.startDate — ' + $t('startDate')"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Start Time -->
    <div class="field is-horizontal" v-if="!calendar.allDay">
      <div class="field-label is-normal">
        <label class="label" :title="'calendar.startTime — ' + $t('startTime')">{{$t('startTime')}}</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <input
              class="input"
              type="time"
              v-model="calendar.startTime"
              :title="'calendar.startTime — ' + $t('startTime')"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- End Date -->
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label" :title="'calendar.endDate — ' + $t('endDate')">{{$t('endDate')}}</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <input
              class="input"
              type="date"
              v-model="calendar.endDate"
              :title="'calendar.endDate — ' + $t('endDate')"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- End Time -->
    <div class="field is-horizontal" v-if="!calendar.allDay">
      <div class="field-label is-normal">
        <label class="label" :title="'calendar.endTime — ' + $t('endTime')">{{$t('endTime')}}</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <input
              class="input"
              type="time"
              v-model="calendar.endTime"
              :title="'calendar.endTime — ' + $t('endTime')"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- All Day Toggle -->
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label" :title="'calendar.allDay — ' + $t('allDay')">{{$t('allDay')}}</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <label class="checkbox">
              <input type="checkbox" v-model="calendar.allDay" :title="'calendar.allDay — ' + $t('allDay')" />
              {{$t('allDayEvent')}}
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Location (optional) -->
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label" :title="'calendar.location — ' + $t('location')">{{$t('location')}}</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <input
              class="input"
              type="text"
              :placeholder="$t('locationPlaceholder')"
              v-model="calendar.location"
              :title="'calendar.location — ' + $t('location')"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Description (optional) -->
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label" :title="'calendar.description — ' + $t('description')">{{$t('description')}}</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <textarea
              class="textarea"
              :placeholder="$t('descriptionPlaceholder')"
              v-model="calendar.description"
              style="width: 100%"
              :title="'calendar.description — ' + $t('description')"
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
