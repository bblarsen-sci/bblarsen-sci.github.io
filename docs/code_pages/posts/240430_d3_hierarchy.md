---
title: D3 hierarchy
aside: false
date: 2024-04-30
keywords:
    - D3
subtext: Convert a .csv into a D3 hierarchy
---
# {{$frontmatter.title}}
{{$frontmatter.subtext}}

I wanted to figure out how to make a hierarchy using D3. Converting a flat ```.csv``` file into a format that ```D3``` wants turned out to be tricky, but was solved with the ```d3.group``` function. The hierarchy format will allow additional visualizations in the future. Here is a sample, showing three amino acid sites (71, 72, 73), with the mutants and their effects nested in each one. 

<script setup>
import Hierarchy from "/components/graphs/Hierarchy.vue";
</script>


<Hierarchy />


## Data

Here is an example of the data I will be loading. We have site number, wildtype amino acid, mutant amino acid, and then the effect of that mutation on cell entry in entry_CHO_bEFNB2. 

```
site,wildtype,mutant,entry_CHO_bEFNB2
71,Q,C,-1.75
71,Q,D,-1.164
71,Q,E,-1.255
71,Q,F,-1.058
71,Q,G,-1.425
71,Q,H,-0.3764
71,Q,I,-2.171
71,Q,K,0.005061
71,Q,L,-1.072
```

## Get Data into hierarchial format for D3

To convert this tabular format into a hierarchial format for D3, I used this code:

```js
async function fetchData() {
  const response = await fetch(`/data/CHO_bEFNB2_entry.csv`);
  const data = await response.text();
  const parsedData = d3.csvParse(data);
  const group = d3.group(parsedData, d => d.site, d => d.mutant);
  const root = d3.hierarchy(group);
```

Lets inspect ```group```. Calling ```console.log``` shows the data are in this format:


<div class="flex justify-center items-center">
    <img src="/images/code_posts/grouped_data.png" />
</div>

Looks good. Now what about ```root```?

<div class="flex justify-center items-center">
    <img src="/images/code_posts/root_data.png" />
</div>

Now the data are in proper format for plotting the hierarchy.