---
title: Plotting neut curves with Altair
aside: false
date: 2024-05-03
keywords:
    - Altair
subtext: How to plot neut curves.
---

# {{$frontmatter.title}}
{{$frontmatter.subtext}}

## Python code to make neutralization curves with Altair.

We often want to know how well an antibody inhibits viral infection of cells. To do this, we make neutralization curves of virus with either antibodies or soluble receptor (could be anything that inhibits infection). Dilutions of neutralizing antibodies are added to virus for 1 hour, followed by infection of cells. After 48 hours, the amount of Luciferase signal is measured with a plate reader, as a proxy for the amount of virus that infected the cells. Viruses that were in the presence of higher concentrations of antibody are neutralized more, and cannot infect cells. 

The neutcurve package we will be using to fit the actual curves also makes plots with ```matplotlib```, but I didn't really like the look of them, and wanted to make nice looking ones with ```Altair```. Heres an example:

<div class="flex justify-center items-center">
    <img src="/images/code_posts/ephrin_b2.pdf" />
</div>


## Data

The data we have are:
- 'serum' - In this case we are actually measuring neutralization by soluble receptor, not sera, but the neutcurve package requires certain column names, so bear with me, we will fix later.
- 'virus' - Again, neutcurve requires certain names. These are actually the different soluble receptors.
- 'concentration' - The concentration of antibody or soluble receptor that were added (in microgram per milliliter)
- 'fraction_infectivity' - The amount of infection at each concentration relative to conditions where **no** antibody or receptor were added.


<div class="flex justify-center items-center">
    <img src="/images/code_posts/neut_curve_df.png" />
</div>

## Script

Import packages.

```python
from IPython.display import display, HTML, SVG
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
import neutcurve
from neutcurve.colorschemes import CBPALETTE
from neutcurve.colorschemes import CBMARKERS
import scipy.stats
import yaml
import altair as alt
import re
print(f"Using `neutcurve` version {neutcurve.__version__}")
```
Read in the data as a ```.csv```. Here, I slightly adjust the names of some of the data.

```python
# First, load in the neut data
df = pd.read_csv(ephrin_binding_neuts_file)

# In this particular case I want to fix the names
df["virus"] = df["virus"].replace(
    {
        "E2-dimeric": "dimeric-bEFNB2",
        "E2-monomeric": "monomeric-bEFNB2",
        "E3-dimeric": "dimeric-bEFNB3",
        "E3-monomeric": "monomeric-bEFNB3",
    }
)
```
Ok, so now that we have our data, lets fit the curves. I do this in a loop to extract curves for each 'virus', then concatante them all. In order to get bars for the measurements, we have to do some calculations and assign them back to the ```curve``` dataframe.

```python
fits = neutcurve.curvefits.CurveFits(
    data=df,
    fixbottom=0,
)

fitParams = fits.fitParams(ics=[50, 90, 95, 97, 98, 99]) #what ICs we want to estimate


def extract_dataframe_from_neutcurve(serum, viruses, replicate="average"):
    curves = []
    # Loop over each virus type and retrieve the curve
    for virus in viruses:
        curve = fits.getCurve(serum=serum, virus=virus, replicate=replicate)
        df = curve.dataframe()
        df["virus"] = virus
        curves.append(df)

    # Concatenate all the dataframes into one
    combined_curve = pd.concat(curves, axis=0)
    return combined_curve


serum = "CHO-EFNB3"  # pull out the neuts that were done on CHO-EFNB3 cells, not E2
viruses = ["dimeric-bEFNB2", "monomeric-bEFNB2", "dimeric-bEFNB3", "monomeric-bEFNB3"]
curve = extract_dataframe_from_neutcurve(serum, viruses)
curve["upper"] = curve["measurement"] + curve["stderr"]
curve["lower"] = curve["measurement"] - curve["stderr"]
```

Now we have a pandas dataframe called ```curve``` that contains the fits. Lets go ahead and plot these data with altair. We need to plot three separate things then combine them together at the end.
- A line plot with the fit
- A circle plot that contains the actual data we collected.
- Std deviation bars on each point.

```python
def plot_neut_curve(df):
    chart = (
        alt.Chart(df)
        .mark_line(size=1.5)
        .encode(
            x=alt.X(
                "concentration:Q",
                scale=alt.Scale(type="log"),
                axis=alt.Axis(format=".0e"),
                title="Concentration (μM)",
            ),
            y=alt.Y(
                "fit:Q",
                title="Fraction Infectivity",
            ),
            color=alt.Color("virus", title="Receptor"),
        )
        .properties(
            width=300, height=200
        )
    )
    circle = (
        alt.Chart(df)
        .mark_circle(size=40,opacity=1)
        .encode(
            x=alt.X(
                "concentration",
                scale=alt.Scale(type="log"),
                axis=alt.Axis(format=".0e",tickCount=3),
                title="Concentration (μM)",
            ),
            y=alt.Y("measurement:Q", title="Fraction Infectivity"),
            color=alt.Color("virus", title="Receptor"),
        )
        .properties(
            width=300, height=200
        )
    )
    error = (
        alt.Chart(df)
        .mark_errorbar(opacity=1)
        .encode(
            x="concentration",
            y=alt.Y("lower", title="Fraction Infectivity"),
            y2="upper",
            color="virus",
        )
        .properties(
            width=300, height=200
        )
    )
    plot = chart + circle + error
    return plot


ephrin_curve = plot_neut_curve(curve)
ephrin_curve.display()
```


Running that, we get the following nice looking neut curve plot that was made with Altair. 

<div class="flex justify-center items-center">
    <img src="/images/code_posts/altair_neut_curve-01.png" />
</div>