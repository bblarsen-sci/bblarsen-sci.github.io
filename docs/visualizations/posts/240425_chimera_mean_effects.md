---
title: Mapping quantitative values onto protein structures
date: 2024-04-25
keywords:
  - ChimeraX
subtext: How to map aggregate deep mutational scanning measurements on a protein structure using ChimeraX.
thumbnail: /thumbnails/chimera_mean_effects.png
---

<div class='prose dark:prose-dark dark:prose-invert'>
<h1> {{$frontmatter.title}} </h1>

{{$frontmatter.subtext}}

<div class="flex justify-center items-center">
    <img src="/images/entry_tetramer_better.png" class="sm:w-1/6 md:w-1/4 lg:w-1/2"/>
</div>

<figcaption style="text-align: center; color: grey; font-size: smaller">Structure of the Nipah receptor binding protein colored by the average effects of mutations.</figcaption>

<p>To map effects of DMS onto a protein in ChimeraX, you need a `.defattr` file in this format:</p>

```tsv
attribute: entry
match mode: any
recipient: residues
	:71	0.044
	:72	0.08
	:73	0.131
	:74	-0.004
	:75	0.099
    ...
```

<p>
Where the attribute is the **name** of what you are mapping, which will be called in ChimeraX, the match mode is how to match the residues, and the recipient is the residues. This is followed by the site number and the effect. Since the DMS data is in a `.csv` file, I wrote a Python script to aggregate the mean effects of mutations by site and then writes them to a `.defattr` file.</p>


```python
import math
import os
import shutil
import pandas as pd
import csv
import subprocess
def aggregate_entry_mean(infile,name,outfile):
    df = pd.read_csv(infile)
    # Use pandas to calculate the mean at each site.
    tmp_df = df.groupby('site')['effect'].mean().reset_index()

    # Modify the dataframe to prepend a tab character and format as strings
    tmp_df['site'] = tmp_df['site'].astype(str)
    tmp_df['effect'] = tmp_df['effect'].astype(str)
    tmp_df['formatted'] = '\t' + ':' + tmp_df['site'] + '\t' + tmp_df['effect']

    with open(outfile, 'w') as f:
        # Write header lines
        f.write(f'attribute: {name}\n')
        f.write('match mode: any\n')
        f.write('recipient: residues\n')

    # Append the tab separated dataframe to the file without quotes and with an escape character
    tmp_df['formatted'].to_csv(outfile, sep='\t', index=False, header=False, mode='a')
    subprocess.run(['sed', '-i', 's/"//g', outfile], check=True)

# Call function above. Takes input .csv and exports .defattr.
aggregate_entry_mean(E2_func_infile,'E2_entry_mean',E2_func_output)
aggregate_entry_mean(E3_func_infile,'E3_entry_mean',E3_func_output)
```

<p>Now that we have a file in the correct .defattr format, I load everything into ChimeraX using a `.cxc` file that can be interpreted by ChimeraX. Note, most of these parameters are highly flexible, this is just an example. It is possible to run these commands one at a time in ChimeraX, however I prefer to have most things automated. I will usually comment out the `save` command at the end to get the view I want, then run that command at the end once I'm ready to make a nice image.</p>

```tsv
# open PDB file
open 2vsm

# setup the view so cartoons look nicer, and hide everything to start from scratch.
preset cartoons/nucleotides licorice/ovals
hide atoms
hide cartoon

# Set lighting and graphics
lighting qualityOfShadows finer
graphics quality 4
lighting gentle
set bgColor white

# Use silhouettes
graphics silhouettes true
graphics silhouettes depthJump 0.01 width 2.5

# If you want to show cartoons, can adjust the width and thickness.
cartoon style width 1 thickness 1

# Show the surface of chain A, with a probeRadius of 2 to hide any holes.
surface /a probeRadius 2
show /a surface

#color surface before mapping on the mean effects of mutations
color /a dimgray

# Open the .defattr file we made earlier with the mean effects of mutations.
open ../input/entry_mean.defattr

# Color the surface of the protein by the mean effects of mutations. Can adjust the domain or the colors used.
color byattr entry palette -4,#AA2531:0,white:2,#134B85

# Save the image with a transparent background and a high resolution.
save output.png supersample 3 transparentBackground true height 3000 width 3000
```

<p>
If you want to label certain amino acids, you can select them, then use the label command with custom formatting (i.e. V444 or S555).</p>

```tsv
sel :119-139,162-180,198-217,251-272,317-334,579-592

label sel residues text "{0.label_one_letter_code}{0.number}" offset 0,0,0 height 0.75 font Helvetica bgColor transparent color black
```
</div>