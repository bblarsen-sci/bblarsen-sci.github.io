---
title: Altair neutralization curves
aside: false
date: 2024-05-03
keywords:
  - Altair
subtext: How to plot nice neutralization curves using Altair.
thumbnail: /thumbnails/altair_neut_curve.png
---

<div class='prose dark:prose-dark dark:prose-invert'>
<h1>{{$frontmatter.title}}</h1>

<h2>{{$frontmatter.subtext}}</h2>

Example I will be using, showing inhibition of Nipah pseudovirus with different soluble receptor constructs.

<div class="flex justify-center items-center">
    <img src="/images/code_posts/altair_neut_curve-01.png" />
</div>

<h2>Python code to make neutralization curves with Altair</h2>

We often want to know how well an antibody inhibits viral infection of cells. To do this, we make neutralization curves of virus with either antibodies or soluble receptor (could be anything that inhibits infection). Dilutions of neutralizing antibodies are added to virus for 1 hour, followed by infection of cells. After 48 hours, the amount of Luciferase signal is measured with a plate reader, as a proxy for the amount of virus that infected the cells. Viruses that were in the presence of higher concentrations of antibody are neutralized more, and cannot infect cells.

The [`neutcurve`](https://jbloomlab.github.io/neutcurve/){target="_self"} package we will be using to fit the actual curves also makes plots with `matplotlib`, but I didn't really like the look of them, and wanted to make nice looking ones with `Altair`. Heres an example of the default plot:

<div class="flex justify-center items-center">
    <img src="/images/code_posts/ephrin_b2.pdf" />
</div>

<h2> Data</h2>

The data we have are:

- 'serum' - In this case we are actually measuring neutralization by soluble receptor, not sera, but the neutcurve package requires certain column names, so bear with me, we will fix later.
- 'virus' - Again, neutcurve requires certain names. In this case we just used unmutated nipah pseudovirus.
- 'replicate' - two replicates of the data.
- 'concentration' - The concentration of antibody or soluble receptor that were added (in this specific example, micromolar)
- 'fraction_infectivity' - The amount of infection at each concentration relative to conditions where **no** antibody or receptor were added.

<div class="flex justify-center items-center">
    <img src="/images/code_posts/neut_curve_df.png" />
</div>

<h2> Script</h2>

Import packages.

<pre>
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
</pre>

Read in the data as a `.csv`. Here, I slightly adjust the names of some of the data.

<pre>
# First, load in the neut data
df = pd.read_csv(ephrin_binding_neuts_file)
</pre>

Ok, so now that we have our data, lets fit the curves. I do this in a loop to extract curves for each 'serum' and 'virus', then concatante them all into a single dataframe. In order to get bars for the measurements, we have to do some calculations and assign them back to the `curve` dataframe. The function 'get_neutcurve' does all of this so we call it and assign it to 'neutcurve_df'.

<pre>
def get_neutcurve(df, replicate="average"):
    #estimate fits
    fits = neutcurve.curvefits.CurveFits(
        data=df,
        serum_col="serum",
        virus_col="virus",
        replicate_col="replicate",
        conc_col="concentration",
        fracinf_col="fraction infectivity",
        fixbottom=0,
    )

    fitParams = fits.fitParams(ics=[50, 90, 95, 97, 98, 99])

    #get list of different sera and viruses that were tested
    serum_list = list(df["serum"].unique())
    virus_list = list(df["virus"].unique())

    curves = [] #initialize an empty list to store neutralization curve data

    # Loop over each serum type and retrieve the curve
    for serum in serum_list:
        for virus in virus_list:
            curve = fits.getCurve(serum=serum, virus=virus, replicate=replicate)
            neut_df = curve.dataframe() #turn into a dataframe
            neut_df["serum"] = serum #assign serum name to a column
            neut_df["virus"] = virus #assign virus name to a column
            curves.append(neut_df)

    # Concatenate all the dataframes into one
    combined_curve = pd.concat(curves, axis=0)
    combined_curve["upper"] = combined_curve["measurement"] + combined_curve["stderr"]
    combined_curve["lower"] = combined_curve["measurement"] - combined_curve["stderr"]

    return combined_curve


neutcurve_df = get_neutcurve(df)
</pre>

Now we have a pandas dataframe called `neutcurve_df` that contains all the data needed for plotting. Lets go ahead and plot these data with altair. We need to make three separate plots, then combine them together at the end.

- A line plot with the fit
- A circle plot that contains the actual data we collected.
- Std deviation bars on each point.

<pre>
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
            color=alt.Color("serum", title="Receptor"),
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
            color=alt.Color("serum", title="Receptor"),
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
            color="serum",
        )
        .properties(
            width=300, height=200
        )
    )
    plot = chart + circle + error
    return plot


ephrin_curve = plot_neut_curve(neutcurve_df)
ephrin_curve.display()
</pre>

Running that, we get the following nice looking neut curve plot that was made with Altair. If you choose to run, you will likely see something slightly different, as I am applying a custom [theme](/visualizations/posts/240503_altair_theme) to the altair figure.

<div class="flex justify-center items-center">
    <img src="/images/code_posts/altair_neut_curve-01.png" />
</div>
</div>