<template>
  <div class="mx-auto max-w-screen-md px-4 lg:px-6">
    <h1 class="py-16">Publications</h1>
    <div class="flex flex-row pb-2 text-sm uppercase tracking-wider items-end">
      <a
        v-for="section in sections"
        :key="section.id"
        class="inline-flex flex-1 border-none align-text-bottom text-center justify-evenly hover:text-red-500 max-w-36 mx-auto"
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
            class="p-4 rounded-lg border border-slate-200 shadow hover:border-slate-400 hover:shadow-lg dark:border-slate-700 dark:hover:border-slate-400"
          >
            <a class="border-none flex flex-col gap-2 h-full" :href="paper.link">
              <strong class="mb-2">{{ paper.title }}</strong>
              <p class="text-center mb-4">{{ paper.journal }}, {{ paper.year }}</p>
              <p class="line-clamp-3 opacity-70 flex-grow">{{ paper.abstract }}</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

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
    fetch('../preprints.json')
      .then((response) => response.json())
      .then((data) => {
        this.sections[0].data = data;
      });
    fetch('../papersFirst.json')
      .then((response) => response.json())
      .then((data) => {
        this.sections[1].data = data;
      });
    fetch('../papersSecond.json')
      .then((response) => response.json())
      .then((data) => {
        this.sections[2].data = data;
      });
  },
};
</script>
