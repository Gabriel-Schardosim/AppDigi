import moment from 'moment-timezone';

export class DateUtils {

  static formatDateToBr(date: string) {
    try {
      date = date?.split('T')[0];
    } catch (e){}
    return moment(date).format('DD/MM/YYYY');
  }

  static formatStringDateBrToUs(date: string | null) {
    if (date != null) {
      date = date.replace(/[^0-9]/g, '');
      let dia = date.substring(0, 2);
      let mes = date.substring(2, 4);
      let ano = date.substring(4, 8);
      return ano + '-' + ("0" + mes).slice(-2) + '-' + ("0" + dia).slice(-2);
    }
    return date;
  }

  static formatDateToUs(date: string | Date) {
    return moment(date).format('YYYY-MM-DD');
  }

  static formatDateTimeToUs(date: string, fuso = false) {
    let dateMoment = moment(date);
    if (fuso) {
      return dateMoment.tz('UTC').format('YYYY-MM-DDTHH:mm:ss');
    } else {
      return moment(date).format('YYYY-MM-DDTHH:mm:ss');
    }
  }

  static formatDateTimeToBr(date: string | Date, fuso = false) {
    let dateMoment = moment(date);
    if (fuso) {
      return dateMoment.tz('America/Sao_Paulo').format('DD/MM/YYYY HH:mm');
    } else {
      return dateMoment.format('DD/MM/YYYY HH:mm');

    }
  }

  static converteParaISODiminuiTimezone(data: Date): any {
    try {
      return new Date(data.getTime() - (data.getTimezoneOffset() * 60000)).toISOString();
    } catch (e) {
      return new Date(data).toISOString();
    }
  }

  static converteParaISOSomaTimezone(data: Date): any {
    try {
      return new Date(data.getTime() + (data.getTimezoneOffset() * 60000)).toISOString();
    } catch (e) {
      return new Date(data).toISOString();
    }
  }

}
