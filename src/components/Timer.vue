<template>
  <div class="timer-block">
    <h2>{{ timer.title }}</h2>
    <h1>{{ formatTime }}</h1>
    <button @click="start">Restart</button>
    <button @click="pauseInterval">Pause</button>
    <button @click="triggerInterval">Continue</button>
  </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import TimerComponent from '@/components/Timer.vue';
import { mapGetters } from 'vuex';
import { Watch } from 'vue-property-decorator';

@Options({
  components: {
    timer: TimerComponent,
  },
  computed: {
    ...mapGetters(['progress', 'timer'])
  }
})
export default class Timer extends Vue {
  seconds = 0;
  isTimerRunning = false;
  timer!: {
    title?: string,
    time: number,
    type: string
  };
  progress!: {
    started: boolean,
    startedTime: number,
    time: number,
    block: number,
    repetition: number,
    step: number
  };

  mounted(): void {
    this.onProgressChange(this.timer, this.timer);
  }
  @Watch('timer', {
    deep: true
  })
  onProgressChange(newValue: {
    title?: string,
    time: number,
    type: string
  }, oldValue: {
    title?: string,
    time: number,
    type: string
  }) {
    if (this.timer.time > 0) {
      this.start();
    }
  }

  timerInterval: ReturnType<typeof setInterval> = 0;

  get formatTime() {
    // Format seconds as mm:ss
    const minutes = Math.floor(this.seconds / 60)
    const seconds = this.seconds % 60
    return `${this.pad(minutes)}:${this.pad(seconds)}`
  }

  onTimerRing() {
    console.trace('ring')
  }

  start() {
    this.stop()
    console.trace('Starting interval')
    this.isTimerRunning = true
    this.seconds = this.timer.time
    this.triggerInterval()
  }
  triggerInterval() {
    this.pauseInterval()
    this.timerInterval = setInterval(() => {
      if (--this.seconds <= 0) {
        this.finish()
      }
    }, 1000)
  }
  finish() {
    console.trace('Finishing interval')
    this.stop()
    this.$emit('ring')
  }
  pauseInterval() {
    clearInterval(this.timerInterval)
  }
  stop() {
    console.trace('Stopping interval')
    this.isTimerRunning = false
    this.seconds = 0
    this.pauseInterval()
  }
  pad(value: number) {
    // Add leading zero if needed
    return value < 10 ? '0' + value : value
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style></style>
