(() => {
  const chart = document.getElementById("ledger-chart");
  if (!chart) {
    return;
  }

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const values = [140000, 190000, 255000, 330000, 415000, 505000, 615000, 740000, 885000, 1040000, 1185000, 1375000];

  const width = 960;
  const height = 360;
  const left = 72;
  const right = 30;
  const top = 24;
  const bottom = 62;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;

  const maxValue = Math.max(...values);
  const minValue = 0;
  const stepX = plotWidth / (values.length - 1);

  const x = (index) => left + index * stepX;
  const y = (value) => top + plotHeight - ((value - minValue) / (maxValue - minValue)) * plotHeight;
  const fmtGold = (n) => `${n.toLocaleString("en-US")}g`;

  const make = (name, attrs = {}) => {
    const node = document.createElementNS("http://www.w3.org/2000/svg", name);
    Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, String(v)));
    return node;
  };

  for (let i = 0; i <= 5; i += 1) {
    const yPos = top + (plotHeight / 5) * i;
    chart.appendChild(make("line", { x1: left, y1: yPos, x2: width - right, y2: yPos, class: "chart-grid" }));
  }

  chart.appendChild(make("line", { x1: left, y1: top + plotHeight, x2: width - right, y2: top + plotHeight, class: "chart-axis" }));
  chart.appendChild(make("line", { x1: left, y1: top, x2: left, y2: top + plotHeight, class: "chart-axis" }));

  for (let i = 0; i < months.length; i += 1) {
    chart.appendChild(
      make("text", {
        x: x(i),
        y: top + plotHeight + 24,
        "text-anchor": "middle",
        class: "chart-xlabel",
      })
    ).textContent = months[i];
  }

  for (let i = 0; i <= 5; i += 1) {
    const value = Math.round((maxValue / 5) * (5 - i));
    const yPos = top + (plotHeight / 5) * i + 4;
    chart.appendChild(
      make("text", {
        x: left - 10,
        y: yPos,
        "text-anchor": "end",
        class: "chart-ylabel",
      })
    ).textContent = fmtGold(value);
  }

  const points = values.map((v, i) => `${x(i)},${y(v)}`);
  const lineD = `M ${points.join(" L ")}`;
  const areaD = `${lineD} L ${x(values.length - 1)},${top + plotHeight} L ${x(0)},${top + plotHeight} Z`;

  const area = make("path", { d: areaD, class: "chart-area", opacity: "0.1" });
  const line = make("path", { d: lineD, class: "chart-line" });
  chart.appendChild(area);
  chart.appendChild(line);

  values.forEach((value, i) => {
    const point = make("circle", {
      cx: x(i),
      cy: y(value),
      r: 5,
      class: "chart-point",
      opacity: "0",
    });
    const amount = make("text", {
      x: x(i),
      y: y(value) - 11,
      "text-anchor": "middle",
      class: "chart-amount",
      opacity: "0",
    });

    amount.textContent = fmtGold(value);
    chart.appendChild(point);
    chart.appendChild(amount);

    const delay = 500 + i * 120;
    setTimeout(() => {
      point.style.transition = "opacity 320ms ease";
      amount.style.transition = "opacity 320ms ease";
      point.setAttribute("opacity", "1");
      amount.setAttribute("opacity", "1");
    }, delay);
  });

  const length = line.getTotalLength();
  line.style.strokeDasharray = String(length);
  line.style.strokeDashoffset = String(length);
  line.getBoundingClientRect();

  requestAnimationFrame(() => {
    line.style.transition = "stroke-dashoffset 1900ms cubic-bezier(0.2, 0.8, 0.2, 1)";
    line.style.strokeDashoffset = "0";
    area.style.transition = "opacity 1300ms ease";
    area.setAttribute("opacity", "1");
  });
})();
