import SweetAlert from "sweetalert2";
import moment from "moment";
import { pdf } from "@react-pdf/renderer";

// Gives Converted Date
export function diff_minutes(dt2, dt1) {
  var diff = (new Date(dt2).getTime() - new Date(dt1).getTime()) / 1000;
  diff /= 60;
  return time_convert(Math.abs(Math.round(diff)));
}
export function diff_minutes_layover(dt2, dt1) {
  var diff = new Date(dt2).getTime() - new Date(dt1).getTime();
  return diff;
  // return time_convert(Math.abs(Math.round(diff)));
}

// Only Calculates Difference and returns result in Minutes
export function diff_in_minutes(dt2, dt1) {
  var diff = (new Date(dt2).getTime() - new Date(dt1).getTime()) / 1000;
  diff /= 60;
  return Math.abs(Math.round(diff));
}

export function time_convert(num) {
  var m1 = num;
  if (isNaN(m1)) m1 = 0;
  var t3 = m1;
  var t4 = Math.floor(t3 / 1440); // Days
  var t5 = t3 - t4 * 1440;
  var t6 = Math.floor(t5 / 60); // Hours
  var t7 = t5 - t6 * 60; // Minutes
  if (Number(t4) === 0) {
    if (Number(t7) === 0) {
      return t6 + " Hours ";
    } else if (Number(t6) === 0) {
      return t7 + "  Minutes";
    } else {
      return t6 + "  Hours  " + t7 + "  Minutes";
    }
  } else {
    return "  " + t4 + "  Days  " + t6 + "  Hours  " + t7 + "  Minutes";
  }
}

export function airsial_time_convert(num) {
  let sialTime = num.split(" ");
  let ampm = sialTime[1];

  sialTime = sialTime[0].split(":");

  let hours = sialTime[0] > 12 ? `${sialTime[0] - 12}` : `${sialTime[0]}`;

  if (hours === "00") {
    hours = 12;
  }

  if (hours.length === 1) {
    hours = `0${hours}`;
  }

  let minutes = sialTime[1];

  return `${hours}:${minutes} ${ampm}`;
}

export function date_convert(date) {
  return new Date(date).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function date_convert_hotels(date) {
  return new Date(date)
    .toLocaleDateString("en-GB", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    })
    .replaceAll("/", "-");
}

export function FormatDate(date) {
  const year = new Intl.DateTimeFormat("en", { year: "numeric" }).format(date);
  const month = new Intl.DateTimeFormat("en", { month: "2-digit" }).format(
    date
  );
  const day = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(date);

  return `${year}-${month}-${day}`;
}
export function TimeZone(time) {
  let extractedZone = "";
  if (time.indexOf("+") > -1) {
    let zone = time.split("+");
    extractedZone = "UTC +" + zone[1];
  } else {
    let zone = time.split("-");
    extractedZone = "UTC -" + zone[zone.length - 1];
  }
  return extractedZone;
}
export function utc_convert(date) {
  if (date.indexOf("+") > -1) {
    date = date.split("+");
    date = date[0];
  } else {
    date = date.split("-");
    let len = date.length;
    let x = "";
    date.map((d, index) => {
      if (len === 4) {
        if (index !== len - 1) {
          x += "-" + d;
        }
      } else {
        if (index !== len - 1) {
          x += "-" + d;
        } else {
          x += "-" + d;
        }
      }
      return 0;
    });
    if (x.indexOf("-") === 0) {
      x = x.slice(1);
    }
    date = x;
  }
  const utc = new Date(date);
  var hours = utc.getHours();
  var minutes = utc.getMinutes();
  var ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
}

export function time_zone(time) {
  let extractedZone = "";
  if (time.indexOf("+") > -1) {
    let zone = time.split("+");
    extractedZone = "UTC +" + zone[1];
  } else {
    let zone = time.split("-");
    extractedZone = "UTC -" + zone[zone.length - 1];
  }
  return extractedZone;
}

export function days_between(startDate, endDate) {
  var millisecondsPerDay = 24 * 60 * 60 * 1000;
  return (treatAsUTC(endDate) - treatAsUTC(startDate)) / millisecondsPerDay;
}

export function get_month_num(mon) {
  let d = Date.parse(mon + " 21, 2012");
  if (!isNaN(d)) {
    let x = new Date(d).getMonth() + 1;
    if (x < 10) {
      return "0" + x;
    } else {
      return x;
    }
  }
  return -1;
}

export function ShowAlert(status, message) {
  if (status === "400") {
    SweetAlert.fire({
      title: "Error!",
      text: message,
      icon: "error",
      confirmButtonText: "OK",
    });
  } else if (status === "200") {
    SweetAlert.fire({
      title: "Success!",
      text: message,
      icon: "success",
      confirmButtonText: "OK",
    });
  }
}

export function ValidateEmail(mail) {
  if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
    return true;
  } else {
    return false;
  }
}

export function dates() {
  let Dates = [];
  for (let i = 1; i <= 31; i++) {
    Dates.push({
      value: String(i).padStart(2, 0),
      label: String(i).padStart(2, 0),
    });
  }
  return Dates;
}

export function months() {
  let Months = [];
  moment.months().map((month) => {
    Months.push({ value: month, label: month });
    return "";
  });

  return Months;
}

export function years() {
  let Years = [];
  let dateYear = new Date().getFullYear();

  for (let i = dateYear; i >= dateYear - 150; i--) {
    Years.push({ value: i, label: i });
  }

  return Years;
}

export function expYears() {
  let ExpYears = [];
  let dateYear = new Date().getFullYear();

  for (let i = dateYear; i <= dateYear + 30; i++) {
    ExpYears.push({ value: i, label: i });
  }

  return ExpYears;
}

export function titles(type) {
  let titles = [
    { value: "Mr", label: "Mr." },
    { value: "Ms", label: "Ms." },
  ];

  if (type === "ADT") {
    titles.push({ value: "Mrs", label: "Mrs." });
  }
  if (type === "CNN") {
    titles = [
      { value: "Mr", label: "Mstr." },
      { value: "Ms", label: "Miss." },
    ];
  }
  return titles;
}

export function getMonthNum(mon) {
  let d = Date.parse(mon + " 21, 2012");
  if (!isNaN(d)) {
    let x = new Date(d).getMonth() + 1;
    if (x < 10) {
      return "0" + x;
    } else {
      return x;
    }
  }
  return -1;
}

export const savePdf = async (document, filename) => {
  saveBlob(await pdf(document).toBlob(), filename);
};

export function treatAsUTC(date) {
  var result = new Date(date);
  result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
  return result;
}

export function TextCapitalizeFirst(input) {
  let capitalizedText = "";
  input = input.split(" ");
  input = input.map((inp) => {
    return inp.charAt(0).toUpperCase() + inp.slice(1);
  });
  input.map((inp, index) => {
    if (index === input.length - 1) {
      capitalizedText +=
        inp.charAt(0).toUpperCase() + inp.slice(1).toLowerCase();
    } else {
      capitalizedText +=
        inp.charAt(0).toUpperCase() + inp.slice(1).toLowerCase() + " ";
    }
    return capitalizedText;
  });
  return capitalizedText;
}

// For Removing Duplicate Objects from Arrays
export function uniqueArray(obj) {
  // 'obj' is and Array of Objects
  return obj.filter((value, index) => {
    const _value = JSON.stringify(value);
    return (
      index ===
      obj.findIndex((obj) => {
        return JSON.stringify(obj) === _value;
      })
    );
  });
}

const saveBlob = (blob, filename) => {
  var a = document.createElement("a");
  document.body.appendChild(a);
  a.style.display = "none";
  let url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
};
