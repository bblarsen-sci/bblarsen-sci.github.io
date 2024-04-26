<script>
export default {
  data() {
    return {
      publications: [],
      coauthor: [],
      preprints: []

    };
  },
  mounted() {
    fetch('/papers/papersFirst.json')
      .then(response => response.json())
      .then(data => {
        this.publications = data;
      });
    fetch('/papers/papersSecond.json')
      .then(response => response.json())
      .then(data => {
        this.coauthor = data;
      });
    fetch('/papers/preprints.json')
      .then(response => response.json())
      .then(data => {
        this.preprints = data;
      });
  },
};
</script>

<template>
  <html class="bg-sky-light dark:bg-sky-dark text-slate-600 dark:bg-slate-900 dark:text-slate-400 ">
    <div class="p-4">
      <div class="flex flex-col items-center justify-center h-96 mx-auto">
        <div class="text-center mb-4 text-6xl font-bold text-white">
            <p>About</p>
        </div>
      </div>
    </div>
    <div class="mt-8 mx-10 font-thin">
        <!-- Image on the right -->
        <img src="/images/pallid.jpg" alt="Descriptive Alt Text" class="float-right ml-6 mb-4 w-36 h-36 lg:w-60 lg:h-60 object-cover">
        <!-- Text that wraps around the image -->
        <p class="text-left">
          Viruses infect all organisms across the tree of life. I'm fascinated by their diversity, rapid evolution, and capacity to cause disease.  I am broadly interested in understanding the long-term evolutionary relationship between viruses and mammals. I use a phylogenetic and experimental approach to understand viral diversity, evolution, and host range. My previous research encompasses field work, molecular biology, deep mutational scanning, ancient DNA, and computational/phylogenetic analyses.
        </p>
        
        <br></br>
        <p class="text-left">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        </p>
        <p class="text-left">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras et lacus ligula. Aliquam erat volutpat. Nunc aliquam ullamcorper felis et vehicula. Praesent aliquam, quam eget varius fermentum, est justo sollicitudin urna, sit amet mattis massa est vitae odio. Sed sed dolor vitae dolor feugiat cursus.
        </p>
    </div>
  </html>
</template>



  
