---
title: Altair CSS
aside: false
date: 2024-05-03
keywords:
    - Altair
subtext: How to inject custom CSS into Altair plots.
---

# {{$frontmatter.title}}
{{$frontmatter.subtext}}

## Altair .html files

When making altair plots, we can save them as an .html file with ```plotName.save(plot.html)```. If we inspect the file, we see a typical ```.html``` format. 


```html
<!DOCTYPE html>
<html>
<head>
  <style>
    #vis.vega-embed {
      width: 100%;
      display: flex;
    }

    #vis.vega-embed details,
    #vis.vega-embed details summary {
      position: relative;
    }
  </style>
  <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/vega@5"></script>
  <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/vega-lite@5.15.1"></script>
  <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/vega-embed@6"></script>
</head>
<body>
...Rest of plotting code
```

Under style, we see some default CSS already, to ```#vis.vega-embed```.

## Replacing the default CSS with your own.

Lets say we want to stylize the code with our own CSS. We can either manually remove and add CSS to the ```<style></style>```, or use the python package ```BeautifulSoup```. Here is an example where I overwrite the CSS and replace it with my own for a list of .html files. 

```python
import os
from bs4 import BeautifulSoup

# The directory containing your HTML files
directory = '../docs/public/htmls/'

# List of specific HTML files you want to modify
specific_files = [
    'E2_binding_heatmap.html',
    'E3_binding_heatmap.html',
    'E2_entry_heatmap.html',
    'E3_entry_heatmap.html',
    'HENV26_heatmap_plot.html',
    'HENV32_heatmap_plot.html',
    'HENV117_heatmap_plot.html',
    'HENV103_heatmap_plot.html',
    'm102_heatmap_plot.html',
    'nAH1_heatmap_plot.html',
]

# The new CSS code you want to inject
new_css = """

    #vg-tooltip-element {
        font-family: "Helvetica Light";
        background-color: #000000f8;
        font-size: 14px;
        color: #ffffff;
        border-color: #898989;
        border-width: 0.5px;
        border-radius: 10px;
        line-height: 16px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    #vis.vega-embed {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        font-size: 30px;
        transition: color 0.3s ease-in-out, transform 0.3s ease-in-out;
        animation: fadeIn 2.5s ease-out;
    }
    @keyframes fadeIn {
        from {opacity: 0;}
        to {opacity: 1;}
    }
    #vis.vega-embed details,
    #vis.vega-embed details summary {
        cursor: pointer;
        font-weight: bold;
        color: #333;
        border-radius: 5px;
        margin-bottom: 5px;
    }

"""

# Iterate over each file in the list
for specific_file in specific_files:
    filepath = os.path.join(directory, specific_file)

    # Open and read the specific HTML file
    with open(filepath, 'r', encoding='utf-8') as file:
        soup = BeautifulSoup(file, 'html.parser')

        # Find and remove the existing <style> tag
        existing_style = soup.find('style')
        if existing_style:
            existing_style.decompose()

        # Create a new <style> tag and set its contents
        new_style_tag = soup.new_tag('style')
        new_style_tag.string = new_css
        soup.head.append(new_style_tag)

        # Save the changes back to the file
        with open(filepath, 'w', encoding='utf-8') as file_to_write:
            file_to_write.write(str(soup))

    print(f'CSS injection complete for {specific_file}.')
```

Now, when we open the file, we find the figure has been centered on the page, the tooltip stylings have changed, and there is a nice fade-in animation of the altair heatmap. The possibilities are endless!

[Click here](/htmls/E3_entry_heatmap.html){target="_self"} to see the custom CSS in action!