class Station {
    stationCode: string;
    stationName: string;
   
    constructor(stationCode: string, stationName: string) {
        this.stationCode = stationCode,
        this.stationName = stationName
    }
   
    static fromDeparture(line: string) {
        const stationCode = line.split("|")[1].split("-")[1]
        const stationName = line.split("|")[0].split(" - ")[1]
        return new Station(stationCode, stationName)
    }

    static fromAutocomplete(line: string) {
        const stationCode = line.split("|")[1]
        const stationName = line.split("|")[0]
        return new Station(stationCode, stationName)
    }
}

export { Station };