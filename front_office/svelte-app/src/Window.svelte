<script>
    export let title;
    export let backgroundColor;
</script>

<style>
    .window {
        border-radius: 7px;
        overflow: hidden;
        margin: 20px;
        border: 1px solid #0e2c5c;
        box-shadow: 0px 2px 10px rgba(7, 23, 48, 0.4);
    }
    .top-bar {
        height: 30px;
        border-top: thin solid #081934;
        border-bottom: thin solid #061227;
        background-color: #263238;
        text-align: left;
    }
    .top-bar .title {
        padding: 0 10px;
        display: flex;
        align-items: center;
        height: 100%;
    }
    .circle {
        height: 8px;
        width: 8px;
        margin: 0 3px;
        border-radius: 50%;
        background-color: white;
    }
    .circle.circle-red {
        background-color: #F23969;
    }
    .circle.circle-yellow {
        background-color: #FFC69F;
    }
    .circle.circle-green {
        background-color: #6AE9A0;
    }
    .title .text {
        flex: 1;
        margin-right: 33px;
    }
    .title .text p {
        margin: 0;
        text-align: center;
        color: #40b3ff;
        font-family: monospace;
        font-weight: 600;
    }
    .top-breadcrumbs {
        height: 30px;
        background-color: var(--background-color);
    }
    .window .child {
        height: 100%;
        width: 100%;
        margin: 0;
        border-bottom-left-radius: 7px;
        border-bottom-right-radius: 7px;
    }
</style>

<div class="window" style="--background-color:{backgroundColor}">
    <div class="top-bar">
        <div class="title">
          <div class="circle circle-red"></div>
          <div class="circle circle-yellow"></div>
          <div class="circle circle-green"></div>
          <div class="text">
              <p>{title}</p>
          </div>
        </div>
      </div>
    <div class="top-breadcrumbs"></div>
    <div class="child">
        <slot/>
    </div>
</div>