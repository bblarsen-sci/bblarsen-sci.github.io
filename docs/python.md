# Altair code and figures

[Altair](https://altair-viz.github.io/){target="_self"} is a python package for making interactive plots. This page will cover how to make a few different examples of interactive plots, with a focus on deep mutational scanning data. 


## Interactive plot with slider to move between sites.
For example, here is an interactive plot of the effects of receptor binding protein mutations on the entry of pseudotyped Nipah virus into either of two cell types. The plot is interactive, and you can hover over each point to see the effect of the mutation at that site.


<Altair :showShadow="false" :spec-url="'htmls/entry_letter_plot_slider.html'"></Altair>

Say we have some data in a pandas dataframe that has the effect of mutations at each site for two different cell types. In this case, we have the data on the effect of mutations in cells expressing bat ephrin-B2 (effect_E2) and bat ephrin-B3 (effect_E3).

|     site      |    mutant     | effect_E2 | effect_E3 | mutant_type |
| :-------------: | :-----------: | :------:|:-----:|:-----:|
| 71      | V | 0.1  | 0.4  | Hydrophobic|
| 71      |   F    |   0.3  | -1.3| Aromatic|
| 72 |   Q    |    -4  | -2.1| Hydrophilic|


Assume the pandas dataframe is just called df. We can make a plot like this with the following code.

First, setup the interactivity of the graph.
```python
import altair as alt
import pandas as pd
#setup interactive features
variant_selector = alt.selection_point(
    on="mouseover", empty=False,nearest=True, fields=['site'], value=1
)

selector = alt.selection_point(
    name="SelectorName",
    fields=['site'],
    bind=alt.binding_range(min=71,max=602,step=1,name='Site '),
    value=[{'site': 71}]
)
```
Make the plot, specifiying exact colors for each amino acid class. Otherwise they will change as the slider moves between sites. 
```python
# make amino acid letter plot
chart = (alt.Chart(df)
    .mark_text(size=20)
    .encode(
        alt.X("effect_E2", title=("Entry in CHO-bEFNB2"),axis=alt.Axis(tickCount=4),scale=alt.Scale(domain=[-4,1])),
        alt.Y("effect_E3", title=("Entry in CHO-bEFNB3"),axis=alt.Axis(tickCount=4),scale=alt.Scale(domain=[-4,1])),
        alt.Text('mutant'),
        alt.Color('mutant_type',title='Mutant type',scale=alt.Scale(
                domain=['Aromatic', 'Hydrophilic', 'Hydrophobic','Negative', 'Positive', 'Special'],
                range=["#4e79a7","#f28e2c","#e15759","#76b7b2","#59a14f","#edc949"])),
        tooltip=['site','wildtype','effect_E2','effect_E3'],  
    )
    .add_params(variant_selector,selector) # include the selectors
    .transform_filter(selector) # only show data for the selected site
    .properties(
        height=300,
        width=300,
        title=alt.Title('Effects of RBP mutations on cell entry',offset=30,subtitle='Use slider to see individual mutations at each site')
    )
)
```
Finally, we want to add a vertical and horizontal line at x=0 and y=0, respectively. Finally, we combine the chart with the vertical and horizontal lines.
```python
# Vertical line at x=0
vline = alt.Chart(pd.DataFrame({'x': [0]})).mark_rule(color='gray',opacity=0.5,strokeDash=[2,4]).encode(x='x:Q')
# Horizontal line at y=0
hline = alt.Chart(pd.DataFrame({'y': [0]})).mark_rule(color='gray',opacity=0.5,strokeDash=[2,4]).encode(y='y:Q')
# Combine the amino acid letter plot with the vertical and horizontal lines
final_chart = vline + hline + chart
final_chart.display()
```

## Heatmaps
Because deep mutational scanning generates so much data, it is difficult to visualize effectively. Heatmaps are an excellent way to show everything at once, and is especially useful when tooltips are enabled (as in Altair) which allows users to see the exact value of each point.

Click the button in the upper right to view the full size plot.
<Altair :showShadow="true" :spec-url="'htmls/E3_entry_heatmap.html'"></Altair>

These plots are complicated and require layering multiple different heatmaps (one for mutational effects, one for missing data, one for the wildtype, etc.)

The code showing how this is accomplished can be found [here](/htmls/plot_heatmaps.html){target="_self"}.