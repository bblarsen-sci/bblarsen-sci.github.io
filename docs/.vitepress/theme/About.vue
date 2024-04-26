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
  <html class=" text-slate-600 dark:bg-slate-900 dark:text-slate-400 ">
    <div class="p-4">
      <div class="flex flex-col items-center justify-center h-96 mx-auto bg-waves">
        <div class="text-center mb-4 text-6xl font-bold text-white">
            <p class="text-slate-500">About</p>
        </div>
      </div>
    </div>
    <div class="mt-8 mx-10 font-thin">
        <!-- Image on the right -->
        <img src="/images/pallid.jpg" alt="Descriptive Alt Text" class="float-right ml-6 mb-4 w-36 h-36 lg:w-60 lg:h-60 object-cover">
        <!-- Text that wraps around the image -->
        <p class="text-left">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Consectetur purus ut faucibus pulvinar elementum integer. Auctor neque vitae tempus quam. At varius vel pharetra vel turpis nunc eget lorem. At quis risus sed vulputate odio ut enim blandit volutpat. Id volutpat lacus laoreet non. Porttitor lacus luctus accumsan tortor posuere. Sed enim ut sem viverra aliquet eget. Accumsan in nisl nisi scelerisque. Aliquet eget sit amet tellus cras adipiscing. Lacus vestibulum sed arcu non odio euismod. Non arcu risus quis varius quam quisque.

Aliquam malesuada bibendum arcu vitae. Mattis vulputate enim nulla aliquet porttitor lacus. Aliquam vestibulum morbi blandit cursus risus at ultrices mi. Condimentum lacinia quis vel eros. Sodales ut etiam sit amet nisl purus in mollis. Et tortor consequat id porta. Habitasse platea dictumst vestibulum rhoncus est pellentesque elit. Netus et malesuada fames ac turpis egestas sed tempus urna. Congue mauris rhoncus aenean vel elit scelerisque mauris pellentesque pulvinar. Viverra mauris in aliquam sem fringilla.

Aliquam sem et tortor consequat. Faucibus scelerisque eleifend donec pretium vulputate. Sed felis eget velit aliquet sagittis id consectetur purus. Urna et pharetra pharetra massa massa ultricies mi quis. In ornare quam viverra orci sagittis eu volutpat odio. Aliquet enim tortor at auctor urna. Tempor orci eu lobortis elementum nibh. Diam volutpat commodo sed egestas egestas fringilla phasellus faucibus. Tempus urna et pharetra pharetra massa massa ultricies mi quis. Imperdiet dui accumsan sit amet nulla facilisi morbi tempus iaculis. Dolor purus non enim praesent elementum facilisis. Amet luctus venenatis lectus magna fringilla urna porttitor rhoncus. Eget aliquet nibh praesent tristique magna sit amet purus gravida. Non arcu risus quis varius quam quisque. A pellentesque sit amet porttitor eget dolor. Eget magna fermentum iaculis eu. Ut lectus arcu bibendum at varius vel pharetra vel turpis. Vitae turpis massa sed elementum tempus.
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



  
