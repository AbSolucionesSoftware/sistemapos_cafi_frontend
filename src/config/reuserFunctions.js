export const numerosRandom = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const formatoHora = (hora) => {
  if (!hora) {
    return null;
  } else {
    var newtime = new Date(hora);
    return newtime.toLocaleTimeString("en-US", { hour12: "false" });
  }
};

export const formatoFecha = (fecha) => {
  if (!fecha) {
    return null;
  } else {
    var newdate = new Date(fecha);
    return newdate.toLocaleDateString("es-MX", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
};

export const formatoMexico = (number) => {
  if (!number) {
    return null;
  } else {
    let nueva;
    if (number % 1 === 0) {
      nueva = number;
    } else {
      nueva = parseFloat(number).toFixed(2);
    }
    const exp = /(\d)(?=(\d{3})+(?!\d))/g;
    const rep = "$1,";
    return nueva.toString().replace(exp, rep);
  }
};

export const cleanTypenames = (value) => {
  if (Array.isArray(value)) {
    return value.map(cleanTypenames);
  } else if (value !== null && typeof value === "object") {
    const newObject = {};
    for (const property in value)
      if (property !== "__typename")
        newObject[property] = cleanTypenames(value[property]);
    return newObject;
  } else {
    return value;
  }
}
