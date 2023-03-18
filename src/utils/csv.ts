const csvToJSON = (csv: string) => {
  let lines = csv.split("\n");
  let result = [];
  let headers;
  headers = lines[0].split(",");

  for (let i = 1; i < lines.length; i++) {
    let obj: any = {};

    if(lines[i] == undefined || lines[i].trim() == "") {
      continue;
    }

    let words = lines[i].split(",");
    for(let j = 0; j < words.length; j++) {
      obj[headers[j].trim()] = words[j];
    }

    result.push(obj);
  }
  
  return result;
};

export {
  csvToJSON
};