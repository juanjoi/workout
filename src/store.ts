import { createStore } from 'vuex';

export default createStore({
  state: {
    progress: {
      started: false,
      startedTime: 0,
      time: 0,
      block: 0,
      repetition: 0,
      step: 0
    },
    workout: {
      blocks: [
        {
          repetitions: 2,
          steps: [
            {
              type: 'exercise',
              time: 3,
              title: 'Salto + plancha'
            },
            {
              type: 'rest',
              time: 1
            },
            {
              type: 'exercise',
              time: 3,
              title: 'TRX-Bicepts'
            },
            {
              type: 'rest',
              time: 1
            }
          ]
        }, {
          repetitions: 2,
          steps: [
            {
              type: 'exercise',
              time: 3,
              title: 'Salto + plancha'
            },
            {
              type: 'rest',
              time: 1
            },
            {
              type: 'exercise',
              time: 3,
              title: 'TRX-Bicepts'
            },
            {
              type: 'rest',
              time: 1
            }
          ]
        }
      ]
    }
  },
  mutations: {
    // Define your mutations to update the state here
    setProgress: (state, progress) => state.progress = progress,
    incrementStep: (state) => state.progress.step++,
    incrementRepetition: (state) => state.progress.repetition++,
    incrementBlock: (state) => state.progress.block++,
    resetStep: (state) => state.progress.step = 0,
    resetRepetition: (state) => state.progress.repetition = 0,
    clearProgress: (state) => {
      state.progress.started = false;
      state.progress.startedTime = 0;
      state.progress.time = 0;
      state.progress.block = 0;
      state.progress.repetition = 0;
      state.progress.step = 0;
    },
    startProgress: (state) => {
      state.progress.started = true;
      state.progress.startedTime = Date.now();
      state.progress.time = 0;
      state.progress.block = 0;
      state.progress.repetition = 0;
      state.progress.step = 0;
    },
    updateProgressTime: (state) => state.progress.time = Date.now() - state.progress.startedTime
  },
  actions: {
    // Define your actions here
  },
  getters: {
    progress: (state) => state.progress,
    workout: (state) => state.workout,
    timer: (state) => state.workout.blocks[state.progress.block].steps[state.progress.step]
  },
});