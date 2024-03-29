<template>
  <div class="workout">
    <div v-if="progress.started">
      <div class="breadcrumbs">
        <div class="time">
          <v-icon icon="mdi-clock"></v-icon> {{ formatTime(Math.floor(progress.time / 1000)) }} / {{ formatTime(totalTime)
          }}
        </div>
        <div>
          <div>
            <v-progress-linear class="counter" :model-value="currentBlockPCT" color="#cccccc" height="30">
              {{ progress.block + 1 }} / {{
                workout.blocks.length }}<v-icon icon="mdi-code-braces"></v-icon></v-progress-linear>
          </div>
          <div>
            <v-progress-linear class="counter" :model-value="currentRepetitionPCT" color="#cccccc" height="30">
              {{ progress.repetition + 1 }} / {{
                workout.blocks[progress.block].repetitions }}<v-icon icon="mdi-repeat"></v-icon></v-progress-linear>
          </div>
          <div>
            <v-progress-linear class="counter" :model-value="currentExercisePCT" color="#cccccc" height="30">
              {{ currentExercise }} / {{
                workout.blocks[progress.block].steps.filter(step => step.type === 'exercise').length
              }}<v-icon icon="mdi-dumbbell"></v-icon></v-progress-linear>
          </div>
        </div>
      </div>
      <timer class="timer" :timer='timer' @ring="onTimerRing()"></timer>
    </div>
    <div v-if="!progress.started">
      <v-btn @click="start" icon="mdi-play" size="x-large"></v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import TimerComponent from '@/components/Timer.vue';
import { mapGetters, mapMutations } from 'vuex'

@Options({
  components: {
    timer: TimerComponent
  },
  computed: {
    ...mapGetters([
      'progress',
      'timer',
      'workout'
    ])
  },
  methods: {
    ...mapMutations([
      'setProgress',
      'incrementStep',
      'incrementRepetition',
      'incrementBlock',
      'resetStep',
      'resetRepetition',
      'startProgress',
      'clearProgress',
      'updateProgressTime'
    ])
  }
})
export default class Workout extends Vue {
  timer!: { title: string, time: number };
  progressInterval: ReturnType<typeof setInterval> = 0;
  progress!: {
    started: boolean,
    startedTime: number,
    time: number,
    block: number,
    repetition: number,
    step: number
  };
  workout!: { blocks: Array<{ repetitions: number, steps: Array<{ type: string, time: number, title?: string }> }> };

  setProgress!: (any: any) => void;
  incrementStep!: () => void;
  incrementRepetition!: () => void;
  incrementBlock!: () => void;
  resetStep!: () => void;
  resetRepetition!: () => void;
  startProgress!: () => void;
  clearProgress!: () => void;
  updateProgressTime!: () => void;


  get currentBlockPCT() {
    return (this.progress.block + 1) / this.workout.blocks.length * 100
  }
  get currentRepetitionPCT() {
    return (this.progress.repetition + 1) / this.workout.blocks[this.progress.block].repetitions * 100
  }
  get currentExercisePCT() {
    return this.currentExercise / this.workout.blocks[this.progress.block].steps.filter(step => step.type === 'exercise').length * 100
  }

  get totalTime() {
    return this.workout.blocks
      .map(block => block.repetitions * block.steps.reduce((accum, value) => accum + value.time, 0))
      .reduce((accum, value) => accum + value, 0)
  }

  get currentExercise() {
    return this.workout.blocks[this.progress.block].steps
      .slice(0, this.progress.step + 1)
      .filter(step => step.type === 'exercise')
      .length
  }

  start() {
    console.trace('Start workout')
    this.startProgress();
    this.progressInterval = setInterval(() => {
      this.updateProgressTime()
    }, 1000)
    this.startStep()
  }

  startStep() {
    console.trace(`Starting step ${this.progress.step}`)
    let block = this.workout.blocks[this.progress.block]
    let step = block.steps[this.progress.step]
    if (step.type === 'exercise') {
      this.timer.title = step.title ? step.title : ''
      this.timer.time = step.time
    } else if (step.type === 'rest') {
      this.timer.title = 'Rest'
      this.timer.time = step.time
    }
  }

  formatTime(inputSeconds: number) {
    // Format seconds as mm:ss
    const minutes = Math.floor(inputSeconds / 60)
    const seconds = inputSeconds % 60
    return `${this.pad(minutes)}:${this.pad(seconds)}`
  }
  pad(value: number) {
    // Add leading zero if needed
    return value < 10 ? '0' + value : value
  }
  onTimerRing() {
    console.trace('ring')
    this.incrementStep()
    if (this.progress.step < this.workout.blocks[this.progress.block].steps.length) {
      this.startStep()
    } else {
      this.resetStep()
      this.incrementRepetition()
      if (this.progress.repetition < this.workout.blocks[this.progress.block].repetitions) {
        console.log('start repetition', this.progress.repetition)
        this.startStep()
      } else {
        this.resetRepetition()
        this.incrementBlock()
        if (this.progress.block < this.workout.blocks.length) {
          console.log('start block', this.progress.block)
          this.startStep()
        } else {
          console.log('finish')
          clearInterval(this.progressInterval)
          this.clearProgress();
        }
      }
    }
  }
}
</script>
  
<style>
.workout {
  margin: auto;
  padding: 0;
  text-align: center;

  h1,
  h2 {
    margin: 0;
  }

  .breadcrumbs {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    display: flex;
    flex-direction: row;
    margin: center;

    >div {
      flex-grow: 1;
    }

    p {
      margin: 0;
    }

    .time {
      align-self: center;
    }

    .v-progress-linear__content {
      padding: 5px;
    }
  }

  .timer {}
}
</style>
  