import IPostableObject from "../IPostableObject";

export default class MatchConfiguration implements IPostableObject {
  private _delayTime: number;
  private _autoTime: number;
  private _transitionTime: number;
  private _teleTime: number;
  private _endTime: number;
  private _totalTime: number;

  constructor() {
    this._delayTime = 0;
    this._autoTime = 30;
    this._transitionTime = 0;
    this._teleTime = 120;
    this._endTime = 30;
  }

  public toJSON(): object {
    return {
      delay_time: this.delayTime,
      auto_time: this.autoTime,
      transition_time: this.transitionTime,
      tele_time: this.teleTime,
      end_time: this.endTime
    };
  }

  public fromJSON(json: any): MatchConfiguration {
    const matchConfig: MatchConfiguration = new MatchConfiguration();
    matchConfig.delayTime = json.delay_time || 0;
    matchConfig.autoTime = json.auto_time || 0;
    matchConfig.transitionTime = json.transition_time || 0;
    matchConfig.teleTime = json.tele_time || 0;
    matchConfig.endTime = json.end_time || 0;
    return matchConfig;
  }

  get delayTime(): number {
    return this._delayTime;
  }

  set delayTime(value: number) {
    this._delayTime = value;
    this._totalTime = this._delayTime + this._autoTime + this._transitionTime + this._teleTime;
  }

  get autoTime(): number {
    return this._autoTime;
  }

  set autoTime(value: number) {
    this._autoTime = value;
    this._totalTime = this._delayTime + this._autoTime + this._transitionTime + this._teleTime;
  }

  get transitionTime(): number {
    return this._transitionTime;
  }

  set transitionTime(value: number) {
    this._transitionTime = value;
  }

  get teleTime(): number {
    return this._teleTime;
  }

  set teleTime(value: number) {
    this._teleTime = value;
    this._totalTime = this._delayTime + this._autoTime + this._transitionTime + this._teleTime;
  }

  get endTime(): number {
    return this._endTime;
  }

  set endTime(value: number) {
    this._endTime = value;
  }

  get totalTime(): number {
    return this._totalTime;
  }
}

export const FTC_CONFIG = new MatchConfiguration();

export const FGC_CONFIG = new MatchConfiguration();
FGC_CONFIG.delayTime = 0;
FGC_CONFIG.autoTime = 0;
FGC_CONFIG.teleTime = 150;
FGC_CONFIG.endTime = 30;