var ImmichSlideshowVersion = "1.2.1";
var PlaceholderSrc = "/local/immich-slideshow/placeholder.png";

import {
  LitElement,
  html,
  css,
} from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";

class ImmichSlideshow extends LitElement {

  static get properties() {
    return {
      hass: {},
      config: {}
    };
  }

  render() {
    return html`
     <ha-card style="overflow:hidden;">
      <div class="wrapper" style="height:${this.config.height}">
       <img class="bottom" @load="${this._onBottomLoad}" src="${PlaceholderSrc}" alt="immich-slideshow">
       <img class="top hidden" @error="${this._onTopError}" @load="${this._onTopLoad}" @transitionend="${this._onTopTransitionEnd}" src="${PlaceholderSrc}" alt="immich-slideshow">
      </div>
     </ha-card>
    `;
  }

  firstUpdated() {
    this._doSlideshow();
  }

  _getImg(className) {
    return this.renderRoot.querySelector(".wrapper img." + className);
  }

  _onBottomLoad(e) {
    var bottom = this._getImg("bottom");
    if (!bottom.src.endsWith(PlaceholderSrc)) {
      URL.revokeObjectURL(bottom.src);
    }
  }

  _imgErrorCount = 0;
  _onTopError(e) {
    this._imgErrorCount++;
    if (this._imgErrorCount <= 3) {
      console.log("Immich-Slideshow -> Image load error, loading new image.");
      var top = this._getImg("top");
      URL.revokeObjectURL(top.src);
      top.classList.replace("visible", "hidden");
      this._nextImage();
    }
    else {
      console.log("Immich-Slideshow -> Image load error #" + this._imgErrorCount);
    }
  }

  _onTopLoad(e) {
    this._imgErrorCount = 0;
  }

  _onTopTransitionEnd(e) {
    var top = this._getImg("top");
    var bottom = this._getImg("bottom");
    bottom.src = top.src;
    top.classList.replace("visible", "hidden");
  }

  _slideshow = null;
  _doSlideshow() {
    if (this._slideshow != null) {
      clearTimeout(this._slideshow);
      this._slideshow = null;
    }

    this._nextImage();

    this._slideshow = setTimeout(() => {
      this._slideshow = null;
      this._doSlideshow();
    }, this.config.slideshow_interval * 1000);
  }

  async _nextImage() {
    var top = this._getImg("top");
    top.src = await this._getNextImageURL();
    top.classList.replace("hidden", "visible");
  }

  setConfig(config) {
    if (!config.apikey)
      throw new Error("You need to define an apikey");

    if (!config.host)
      throw new Error("You need to define an host");

    //Robimy kopię obiektu, inaczej nie można dodawać do niego wlasciwosci
    var isconfig = Object.create(config);

    if (!isconfig.height)
      isconfig.height = "100%";
    if (!isconfig.slideshow_interval || isconfig.slideshow_interval < 6)
      isconfig.slideshow_interval = 6;

    this.config = isconfig;
  }

  getCardSize() {
    return 1;
  }

  async _apiGet(url) {
    let call_url = new URL("api/" + url, this.config.host);
    //console.log("apiCall => "+call_url);
    let requestOptions =
    {
      method: 'GET',
      credentials: 'include',
      headers:
      {
        'X-Api-Key': `${this.config.apikey}`
      }
    };
    return fetch(call_url, requestOptions);
  }

  async _getRandomID() {
    return this._apiGet("assets/random")
      .then(response => response.json())
      .then(json => json[0].id);
  }

  async _getNextImageURL() {
    var id = await this._getRandomID();
    return this._apiGet("assets/" + id + "/thumbnail?size=thumbnail").
      then(response => response.blob()).
      then(blob => URL.createObjectURL(blob));
  }

  static get styles() {
    return css`
    .wrapper {
     position: relative;
     width: 100%;
     overflow: hidden;
    }

    img {
     width: 100%;
     height: 100%;
     object-fit: cover;
    }

    img.bottom {
     position: relative;
    }

    img.top {
     position: absolute;
     top: 0;
     left: 0;
    }

    img.visible {
     transition: all 5s ease-in;
     opacity: 1;
    }

    img.hidden {
     transition: none;
     opacity: 0;
    }`;
  }
}

customElements.define("immich-slideshow", ImmichSlideshow);

//INFO----------------------------------------------------------------------------------------------------------------
let infoStyles = [
  "color: #fff",
  "background-color: #444"
].join(";");
console.info("%cImmichSlideshow Version:" + ImmichSlideshowVersion, infoStyles);