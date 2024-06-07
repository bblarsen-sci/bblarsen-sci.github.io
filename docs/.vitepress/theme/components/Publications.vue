<script>
export default {
  data() {
    return {
      sections: [
        { id: 'section-1', title: 'Preprints', data: [] },
        { id: 'section-2', title: 'First Author Publications', data: [] },
        { id: 'section-3', title: 'Co-authored Publications', data: [] },
      ],
    };
  },
  mounted() {
    fetch('/papers/preprints.json')
      .then((response) => response.json())
      .then((data) => {
        this.sections[0].data = data;
      });
    fetch('/papers/papersFirst.json')
      .then((response) => response.json())
      .then((data) => {
        this.sections[1].data = data;
      });
    fetch('/papers/papersSecond.json')
      .then((response) => response.json())
      .then((data) => {
        this.sections[2].data = data;
      });
  },
};
</script>

<template>
  <div class="mx-auto max-w-screen-md px-4 lg:px-6">
    <h1 class="py-16">Publications</h1>
    <div class="flex flex-row items-end pb-2 text-sm uppercase tracking-wider">
      <a
        v-for="section in sections"
        :key="section.id"
        class="mx-auto inline-flex max-w-36 flex-1 justify-evenly border-none text-center align-text-bottom hover:text-red-500"
        :href="`#${section.id}`"
      >
        {{ section.title }}
      </a>
    </div>
    <div class="">
      <div class="h-1 bg-slate-800 dark:bg-slate-300"></div>
      <div v-for="section in sections" :key="section.id">
        <h2 :id="section.id" class="py-10">{{ section.title }}</h2>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="paper in section.data"
            :key="paper.title"
            class="rounded-lg border border-slate-200 p-4 shadow hover:border-slate-400 hover:shadow-lg dark:border-slate-700 dark:hover:border-slate-400"
          >
            <a class="flex h-full flex-col gap-2 border-none" :href="paper.link">
              <strong class="mb-2">{{ paper.title }}</strong>
              <p class="mb-4 text-center">{{ paper.journal }}, {{ paper.year }}</p>
              <p class="line-clamp-3 flex-grow opacity-70">{{ paper.abstract }}</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
