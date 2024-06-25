class AftekenComponent extends HTMLElement {
  studentNr;
  studentName;
  assignmentID;

  constructor() {
    super();
    this.attachShadow({
      mode: "open",
    });
  }

  connectedCallback() {
    window.requestAnimationFrame(() => {
      this.initProps();
      this.render();
      this.bindEvents();
    })
  }

  initProps() {
    this.studentNr = this.getStudentNr();
    this.studentName = this.getStudentName();
    this.assignmentID = this.getAssignmentID();
  }

  render() {
    const data = {
      studentNr: this.studentNr,
      studentName: this.studentName,
      assignmentID: this.assignmentID
    }
    this.shadowRoot.innerHTML = `
      <style>
        qr-code {
          width: 200px;
          height: 200px;
          aspect-ratio: 1;
          position: absolute;
          margin: 10px;
          top: 0;
          right: 0;
        }
      </style>
      <qr-code ${Object.entries(data).map(([key, value]) => `${key}="${value}"`).join(' ')}></qr-code>
      `
  }

  bindEvents() {
    this.shadowRoot.querySelector("qr-code").addEventListener("click", () => {
      this.shadowRoot.querySelector("qr-code").style.display = "none";
    });

    // bind localstorage events
    window.addEventListener("storage", (event) => {
      if (event.key === "studentNr") {
        this.studentNr = event.newValue;
        this.render();
      }
      if (event.key === "studentName") {
        this.studentName = event.newValue;
        this.render();
      }
    });
  }

  getStudentNr() {
    let studentNr = localStorage.getItem("studentNr");
    if (!studentNr) {
      studentNr = prompt("Please enter your student number");
      localStorage.setItem("studentNr", studentNr);
    }
    return studentNr;
  }

  getStudentName() {
    let studentName = localStorage.getItem("studentName");
    if (!studentName) {
      studentName = prompt("Please enter your name");
      localStorage.setItem("studentName", studentName);
    }
    return studentName;
  }

  getAssignmentID() {
    return this.getAttribute("opdracht");
  }
}

window.customElements.define("afteken-component", AftekenComponent);

class QRComponent extends HTMLElement {
  data;
  qrcode;
  dark;

  constructor() {
    super();
    this.attachShadow({
      mode: "open",
    });

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/gh/davidshimjs/qrcodejs@gh-pages/qrcode.min.js';
    this.shadowRoot.appendChild(script);

    script.onload = () => {
      this.render();
    }
  }

  connectedCallback() {
    window.requestAnimationFrame(() => {
      this.initProps();
      this.render();
    })
  }

  initProps() {
    const data = this.attributes;
    this.data = {};
    for (let i = 0; i < data.length; i++) {
      const { name, value } = data[i]
      this.data[name] = value;
    }
  }

  render() {
    if (!this.data) {
      return;
    }
    this.shadowRoot.innerHTML = `
      <style>
      img {
        width: 100%;
        height: 100%;
      }
      </style>
    `
    const wrapper = document.createElement('div');
    wrapper.id = "wrapper"
    this.shadowRoot.appendChild(wrapper)
    const shadowWrapper = this.shadowRoot.getElementById("wrapper")

    this.qrcode = new QRCode(shadowWrapper, JSON.stringify(this.data))
  }
}

customElements.define('qr-code', QRComponent);
