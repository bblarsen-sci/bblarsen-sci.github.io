---
title: Altair themes
aside: false
date: 2024-05-03
keywords:
    - Altair
subtext: How to use Altair themes.
thumbnail: /code_pages/thumbnails/altair_theme.png
---

# {{$frontmatter.title}}
{{$frontmatter.subtext}}

## Make a theme file

When using Altair to make plots, it is often useful to use consistent themes without having to specify everything in each plot manually. Enter themes!

Here is what my ```theme.py``` file looks like, where I specify all the theme values I want to be consistently applied.

```python
import altair as alt
def main_theme():
    # Define Typography
    font = "Helvetica"

    # Define Colors
    main_palette = ["#4e79a7","#f28e2c","#e15759","#76b7b2","#59a14f","#edc949","#af7aa1","#ff9da7","#9c755f","#bab0ab"]
    sequential_palette = ["#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#253494"]

    # Axes
    axisColor = "black"
    gridColor = "#DEDDDD"

    return {
        "config": {
            "background": "transparent",
            "title": {
                "fontSize": 20,
                "fontWeight": 'normal',
                "font": font,
                "anchor": "start",
                "color": "#000000",
                "orient": 'top',
                "offset": 5,
                "subtitleColor": 'gray',
                "subtitleFont": font,
                "subtitleFontWeight": 'normal',
                "subtitleFontSize": 18,
                "subtitlePadding": 2,
            },
            "axis": {
                #domain
                "domain": True,
                "domainColor": axisColor,
                "domainWidth": 1,
                #grid
                "grid": False,
                "gridColor": gridColor,
                "gridWidth": 0.5,
                #label
                "labelFont": font,
                "labelFontSize": 14,
                "labelFlush": False,
                "labelFontWeight": 'normal',
                "labelPadding": 2,
                #"labelAngle": 0,
                
                #ticks
                "tickColor": axisColor,
                "tickSize": 4,
                #"tickCount": 3,
                "tickWidth": 1,
                #title
                "titleFont": font,
                "titleAlign": 'center',
                "titleFontWeight": 'bold',
                "titleFontSize": 14,
                "titlePadding": 5,
            },
            "legend": {
                "labelFont": font,
                "labelFontSize": 14,
                "symbolSize": 100,
                "titleFont": font,
                "titleFontSize": 14,
                "titleFontWeight": 'bold',
                "padding": 5,
                "titleLimit": 200,
                "gradientLength": 100,
            },
            "range": {
                "category": main_palette,
                "diverging": sequential_palette,
            },
            "view": {
                "stroke": "transparent", # Remove the border around the visualization
            	"strokeWidth": 0,
            },
        	"text": {
            	"font": 'Helvetica Light',
            	"fontSize": 14,
        	}
        }
    }
```

To use the theme, we import into the python script with this code:

```python
import sys
#import altair themes from /data/custom_analyses_data/theme.py and enable
sys.path.append('data/custom_analyses_data/')
import theme
alt.themes.register('main_theme', theme.main_theme)
alt.themes.enable('main_theme')
```

And now all altair plots will have that theme consistently applied!