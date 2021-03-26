# 🌖 Charon - a fork of Pluto.jl for experimentation

Hello, welcome to Charon! Are you a beginner? Do you know what Pluto.jl is? If not you probably should head over to [Pluto.jl](https://github.com/fonsp/Pluto.jl)! If not, read on:


*Metaphor time: Charon is a place for those who love Pluto, and would like to stay in its gravity well, keep a close eye on it, and be able to experiment without worrying about contaminating the surface of the planet. Inhabitants of, and visitors to, Charon are interested in inventing things for their own use, that they hope will one day find practical use of the surface of Pluto. Inhabitants of Pluto, on the other hand, may be aware of Charon, if they look up at the sky from whatever awesome stuff they are doing, but they can safely ignore what's happening on Charon unless they are particularly interested.*

The moon [Charon](https://en.wikipedia.org/wiki/Charon_(moon)), the namesake of this repository, is the largest of the 5 known natural satellites of Pluto. It's about half the diameter of Pluto and about 12% of its mass. Charon is mutually tidally locked with Pluto: both bodies keep the same face towards each other. Undeniably, Charon orbits Pluto and not the other way around but it does exert a small influence on Pluto's motion.

<img alt="Pluto and Charon" src="Pluto-Charon_system-new.gif" width=320 height=207>

[Image Credit: Wikimedia commons (CC BY-SA 4.0)](https://commons.wikimedia.org/wiki/File:Pluto-Charon_system-new.gif)

## What is Charon?
Hello, this fork of Pluto.jl is intended to include features that upstream Pluto is not interested (at least presently) in incorporating. This allows interested contributors to add, and use, features they are interested in even when these don't align with the mainline development's 'opinionated' development philosophy.

Part of the thinking here is to be able both to respect the 'opinionated' development of Pluto (which has undeniably been a very successful project and probably due in no small part to this), and to allow some experimentation, but without being an undue distraction to the main developers.

A primary goal is that the upstream main branches (or at least releases) should be able to be cleanly merged to this repo's master branch with only trivial merge conflicts. So necessarily the changes in this repo will tend to be minor and often just cosmetic.

Similarly features should be developed in the expectation/hope that they may one day be incorporated upstream, if not necessarily in exactly their initially implemented forms in the fork.

In the fork, the develop branch is intended to house features once they are functional, and keep up to date with Pluto releases. Feature branches should be used to work on distinct features and develop merged into the feature branch regularly.

This being an unofficial fork doesn't mean that good development practices shouldn't be followed! On the contrary particularly for features that are hoped to one day find their way upstream it's important that these could be easily merged if/when upstream finds it worthwhile to do so.

Compatibility: One **really important** principle is that Charon notebooks **not** undermine the Pluto user base by being grossly incompatible with Pluto. It shouldn't be possible, e.g., to start with a colleague's notebook created with Pluto, make some modifications in Charon, and then send back what is then a broken notebook to Pluto. This shouldn't be an issue with cosmetic/UI changes, but anything that starts to deal with the notebook format in any way needs to be designed very carefully with this in mind.

Similarly it's important that users of Charon are well aware that they are using an unofficial, experimental fork. To that end some conspicuous visual indications will be included. We'll adopt the unicode 🌖 (U+1F316, "waning gibbous moon"). For example in the keyboard shortcuts pop up, added key combinations will use 🌖 to indicate that they are Charon-only.

To avoid divergence, the Pluto name and branding aren't changed in Charon, other than the visual indications above. So for example we don't want to `s/Pluto/Charon/g`. This serves to clearly indicate that Charon isn't meant to be a hard fork of Pluto, but is mainly to avoid complicating merging.

## Features/differences

Any added or changed functionality is listed here for easy reference. Some of the early additions were done without using issues/PRs but new ones should use these and reference them here to easily be able to refer back to discussion/design decisions etc.

### Keyboard shortcuts
* Duplicate lines up/down
* Auto-indent selection
* Add next occurrence to selection
* Toggle wrap lines

# Installation

To discourage non-expert usage of Charon, it won't be a registered package, you need to `dev` it in order to use it. If you don't know what that means then probably you aren't in the audience for Charon.
  
**Original Pluto.jl README contents follow:**

---

<blockquote>
<a href="https://plutojl.org/plutocon2021"><img align="right" src=https://user-images.githubusercontent.com/6933510/111311607-b49a7000-865e-11eb-9c67-dd411b832096.png height="130px"></a>
  <h2><a href="https://plutojl.org/plutocon2021">PlutoCon 2021</a> — April 8th-9th</h2>
  <p>To celebrate Pluto's 1 year anniversary, we are hosting a <b>two day mini conference</b> about.... Pluto! It will be a place to share your fun notebooks and to <b>learn techniques from other Pluto users</b> and from Pluto's designers. <em>You can give a talk!</em></p>
</blockquote>

<br>
<br>
<p align="center"><a href="https://www.youtube.com/watch?v=IAF8DjrQSSk">🎈 Pluto presentation (20 min) at <b>Juliacon 2020</b> 🎈</a></p>

<br>
<br>

<h1><img alt="Pluto.jl" src="https://raw.githubusercontent.com/fonsp/Pluto.jl/dd0ead4caa2d29a3a2cfa1196d31e3114782d363/frontend/img/logo_white_contour.svg" width=300 height=74 ></h1>

_Writing a notebook is not just about writing the final document — Pluto empowers the experiments and discoveries that are essential to getting there._

**Explore models and share results** in a notebook that is

-   **_reactive_** - when changing a function or variable, Pluto automatically updates all affected cells.
-   **_lightweight_** - Pluto is written in pure Julia and is easy to install.
-   **_simple_** - no hidden workspace state; friendly UI.

<img alt="reactivity screencap" src="https://raw.githubusercontent.com/fonsp/Pluto.jl/580ab811f13d565cc81ebfa70ed36c84b125f55d/demo/plutodemo.gif" >
<p align="center"><a href="https://mybinder.org/v2/gh/fonsp/pluto-on-binder/master?urlpath=pluto">🎈 <b>Pluto demo</b> inside your browser 🎈</a></p>

### Input

A Pluto notebook is made up of small blocks of Julia code (_cells_) and together they form a [**_reactive_** notebook](https://medium.com/@mbostock/a-better-way-to-code-2b1d2876a3a0).
When you change a variable, Pluto automatically re-runs the cells that refer to it. Cells can even be placed in arbitrary order - intelligent syntax analysis figures out the dependencies between them and takes care of execution.

Cells can contain _arbitrary_ Julia code, and you can use external libraries. There are no code rewrites or wrappers, Pluto just looks at your code once before evaluation.

### Output

Your notebooks are **saved as pure Julia files** ([sample](https://github.com/fonsp/Pluto.jl/blob/main/sample/Basic.jl)), which you can then import as if you had been programming in a regular editor all along. You can also export your notebook with cell outputs as attractive HTML and PDF documents. By reordering cells and hiding code, you have full control over how you tell your story.

<br >

## Dynamic environment

Pluto offers an environment where changed code takes effect instantly and where deleted code leaves no trace.
Unlike Jupyter or Matlab, there is **no mutable workspace**, but rather, an important guarantee:

<blockquote align="center"><em><b>At any instant</b>, the program state is <b>completely described</b> by the code you see.</em></blockquote>
No hidden state, no hidden bugs.

### Interactivity

Your programming environment becomes interactive by splitting your code into multiple cells! Changing one cell **instantly shows effects** on all other cells, giving you a fast and fun way to experiment with your model.

In the example below, changing the parameter `A` and running the first cell will directly re-evaluate the second cell and display the new plot.

<img alt="plotting screencap" src="https://user-images.githubusercontent.com/6933510/80637344-24ac0180-8a5f-11ea-82dd-813dbceca9c9.gif" width="50%">

<br >

### HTML interaction

Lastly, here's _**one more feature**_: Pluto notebooks have a `@bind` macro to create a **live bond between an HTML object and a Julia variable**. Combined with reactivity, this is a very powerful tool!

<img alt="@bind macro screencap" src="https://user-images.githubusercontent.com/6933510/80617037-e2c09280-8a41-11ea-9fb3-18bb2921dd9e.gif" width="70%">

_notebook from [vdplasthijs/julia_sir](https://github.com/vdplasthijs/julia_sir)_

<br >

You don't need to know HTML to use it! The [PlutoUI package](https://github.com/fonsp/PlutoUI.jl) contains basic inputs like sliders and buttons.

But for those who want to dive deeper - you can use HTML, JavaScript and CSS to write your own widgets! Custom update events can be fired by dispatching a `new CustomEvent("input")`, making it compatible with the [`viewof` operator of observablehq](https://observablehq.com/@observablehq/a-brief-introduction-to-viewof). Have a look at the sample notebooks inside Pluto to learn more!

<br >
<hr >
<br >

# Let's do it!

### Ingredients

For one tasty notebook 🥞 you will need:

-   **Julia** v1.0 or above, _v1.5 is fastest_
-   **Linux**, **macOS** or **Windows**, _Linux and macOS will work best_
-   Mozilla **Firefox** or Google **Chrome**, be sure to get the latest version

### Installation

<p align="center"><a href="https://www.youtube.com/watch?v=OOjKEgbt8AI">🎈 How to install <b>Julia & Pluto</b> (6 min) 🎈</a></p>

Run Julia and add the package:

```julia
julia> ]
(v1.5) pkg> add Pluto
```

_Using the package manager for the first time can take up to 15 minutes - hang in there!_

To run the notebook server:

```julia
julia> import Pluto
julia> Pluto.run()
```

Pluto will open in your browser, and you can get started!

Questions? Have a look at the [FAQ](https://github.com/fonsp/Pluto.jl/wiki).
<br>
<br>
<br>
<blockquote>
<img align="right" src=https://upload.wikimedia.org/wikipedia/commons/0/0c/MIT_logo.svg height="60px">
<p><em>Interested in learning Julia, Pluto and applied mathematics?</em> Join the <strong>open MIT course</strong> taught by <strong>Alan Edelman</strong>, <strong>David P. Sanders</strong> &amp; Grant Sanderson (<strong>3blue1brown</strong>) (<em>and a bit of me</em>): <a href="https://computationalthinking.mit.edu" rel="nofollow">Introduction to Computational Thinking</a>, Spring 2021.
<br></p>
</blockquote>
<br>

### To developers

Follow [these instructions](https://github.com/fonsp/Pluto.jl/blob/main/CONTRIBUTING.md) to start working on the package.

<img src="https://raw.githubusercontent.com/gist/fonsp/9a36c183e2cad7c8fc30290ec95eb104/raw/ca3a38a61f95cd58d79d00b663a3c114d21e284e/cute.svg">

## License

Pluto.jl is open source! Specifically, it is [MIT Licensed](https://github.com/fonsp/Pluto.jl/blob/main/LICENSE). The included sample notebooks have a more permissive license: the [Unlicense](https://github.com/fonsp/Pluto.jl/blob/main/sample/LICENSE). This means that you can use sample notebook code however you like - you do not need to credit us!

Pluto.jl is built by gluing together open source software:

-   `Julia` - [license](https://github.com/JuliaLang/julia/blob/master/LICENSE.md)
-   `CodeMirror` - [license](https://github.com/codemirror/CodeMirror/blob/master/LICENSE)
-   `HTTP.jl` - [license](https://github.com/JuliaWeb/HTTP.jl/blob/master/LICENSE.md)
-   `MsgPack.jl` - [license](https://github.com/JuliaIO/MsgPack.jl)
-   `msgpack-lite` - [license](https://github.com/kawanet/msgpack-lite/blob/master/LICENSE)
-   `observablehq/stdlib` - [license](https://github.com/observablehq/stdlib/blob/master/LICENSE)
-   `preact` - [license](https://github.com/preactjs/preact/blob/master/LICENSE)
-   `developit/htm` - [license](https://github.com/developit/htm/blob/master/LICENSE)
-   `MathJax` - [license](https://github.com/mathjax/MathJax-src/blob/master/LICENSE)

Your notebook files are _yours_, you do not need to credit us. Have fun!

## From the authors

The Pluto project is an ambition to [_rethink what a programming environment should be_](http://worrydream.com/#!/LearnableProgramming). We believe that scientific computing can be a lot simpler and more accessible. If you feel the same, give Pluto a try! We would love to hear what you think. 😊

### You can chat with us

-   contact me (fonsi) **[via email](mailto:fons@plutojl.org)** or on my <a href="https://whereby.com/plutojl"><b>video chat room</b></a> (wait a minute for me to join)
-   talk with fellow Pluto users in the **[Zulip chat room](https://gist.github.com/fonsp/db7d00fd3fe5bc0b379b4af9ec6674b6)** (_search for the `pluto.jl` stream_)
-   use Pluto's **[built-in feedback system:](https://github.com/fonsp/Pluto.jl/issues/182#issue-637726414)**

<img alt="feedback screencap" src="https://user-images.githubusercontent.com/6933510/84502876-6f08db00-acb9-11ea-84c3-f5daaba29273.png" width="100%">

Questions? Have a look at the [FAQ](https://github.com/fonsp/Pluto.jl/wiki).

## Sponsors

Development of Pluto.jl is partially sponsored by

| | |
|----|----|
| <a href="https://computationalthinking.mit.edu"><img title="Massachusetts Institute of Technology" src="https://user-images.githubusercontent.com/6933510/103308960-09412e00-4a14-11eb-8a3a-39201a9c186d.png" width=400 alt="MIT logo"></a> | The free online course _[Introduction to Computational Thinking](https://computationalthinking.mit.edu)_ at **MIT** uses Pluto notebooks to teach scientific computing in a new way. Homeworks react to the student in realtime, with _live answer checks and visualizations_ while you solve problems. |
| <a href="http://quera-computing.com"><img title="QuEra Computing" src="https://user-images.githubusercontent.com/6933510/103309531-9e90f200-4a15-11eb-850f-99609e3b9bd8.png" width=400 alt="QuEra logo"></a> | **QuEra Computing** uses a Pluto notebook as an online dashboard to control their _quantum computer_! |
| <a href="https://juliacomputing.com/"><img title="Julia Computing" src="https://user-images.githubusercontent.com/6933510/110478267-780dc800-80e4-11eb-91e5-2ef0256ad0db.png" width=400 alt="Julia Computing logo"></a> | [JuliaHub](https://juliahub.com) by **Julia Computing** enables the creation and editing of Pluto notebooks *on the cloud*! |
| <a href="https://numfocus.org/"><img title="Julia Computing" src="https://user-images.githubusercontent.com/6933510/110683397-42e4a100-81dc-11eb-9bdb-db58f9c283b4.png" width=400 alt="NumFOCUS logo"></a> | The mission of **NumFOCUS** is to promote open practices in research, data, and scientific computing by serving as a fiscal sponsor for open source projects and organizing community-driven educational programs. |

_Created by [**Fons van der Plas**](https://github.com/fonsp) and [**Mikołaj Bochenski**](https://github.com/malyvsen). Inspired by [Observable](https://observablehq.com/)._
