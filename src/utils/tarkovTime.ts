const hrs = (num: number) => {
    return 1000 * 60 * 60 * num;
};

export interface TarkovTime {
    left: string;
    right: string;
}

export const calculateTarkovTime = (date: Date): TarkovTime => {
    // 1 second real time = 7 seconds tarkov time
    const tarkovRatio = 7;

    const timeFormatting: Intl.DateTimeFormatOptions = {hour: '2-digit', minute:'2-digit', second: '2-digit', hour12: false, timeZone: 'Europe/Moscow'};

    const left = new Date(date.getTime() * tarkovRatio).toLocaleTimeString([], timeFormatting);
    const right = new Date(date.getTime() * tarkovRatio - hrs(12)).toLocaleTimeString([], timeFormatting);

    return {left, right};
};
