<template>
    <div class=" mx-auto px-4 lg:px-6 prose dark:prose-dark max-w-screen-xl">
        <h1 class="py-16">Publications</h1>
        <div class="flex flex-row pb-2 text-sm uppercase tracking-wider">
            <a v-for="section in sections" :key="section.id"
                class="inline-flex flex-1 justify-center border-none hover:text-red-500" :href="`#${section.id}`">
                {{ section.title }}
            </a>
        </div>
        <div class="">
            <div class="h-1 bg-slate-800 dark:bg-slate-300"></div>
            <div v-for="section in sections" :key="section.id">
                <h2 :id="section.id" class="py-16">{{ section.title }}</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10">
                    <div v-for="paper in section.data" :key="paper.title"
                        class="block h-full max-w-sm rounded-lg border border-slate-200 shadow hover:shadow-lg transition duration-300 hover:border-slate-400 dark:border-slate-700 dark:hover:border-slate-400 text-start p-4 mx-auto">
                        <a class="" :href="paper.link">
                            <div class="flex flex-col justify-evenly">
                                <strong class="">{{ paper.title }}</strong>
                                <img v-if="paper.image" :src="paper.image"
                                    class="aspect-square max-h-36 object-cover mx-auto border shadow-md" />
                                <p class=" text-center text-sm">
                                    {{ paper.journal }}, {{ paper.year }}
                                </p>
                                <p class="line-clamp-3 text-xs font-light">{{ paper.abstract }}</p>
                            </div>
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

<style scoped>


</style>
