import {AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, default as Axios} from "axios";
import HttpError from "../models/ems/HttpError";
import IPostableObject from "../models/IPostableObject";
import Event from "../models/ems/Event";
import Team from "../models/ems/Team";
import Match from "../models/ems/Match";
import MatchDetails from "../models/ems/MatchDetails";
import MatchParticipant from "../models/ems/MatchParticipant";
import Ranking from "../models/ems/Ranking";

class FGCProvider {
  private static _instance: FGCProvider;

  private _host: string;
  private _axios: AxiosInstance;
  private _config: AxiosRequestConfig;

  public static getInstance(): FGCProvider {
    if (typeof FGCProvider._instance === "undefined") {
      FGCProvider._instance = new FGCProvider();
    }
    return FGCProvider._instance;
  }

  private constructor() {}

  /**
   * This method must be called before retrieving data. Since this class implements the singleton design
   * and the network of EMS may change, the provider must be manually initialized at runtime.
   */
  public initialize(host: string, port: number): void {
    this._host = "http://" + host + ":" + (port) + "/";
    this._config = {
      baseURL: this._host,
      timeout: 5000,
      headers: {
        "Content-Type": "application/json"
      }
    };
    this._axios = Axios.create(this._config);
  }

  private get(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this._axios.get(url, {data: {}}).then((response: AxiosResponse) => {
        if (typeof response.data !== "undefined" && response.data.length > 0) {
          resolve(response.data);
        } else {
          reject(new HttpError(500, "ERR_NO_DATA", this._host + url));
        }
      }).catch((error: AxiosError) => {
        if (error.response) {
          reject(new HttpError(error.response.data.message, error.response.data.code, this._host + url));
        } else if (error.request) {
          reject(new HttpError(404, "ERR_CONNECTION_REFUSED", this._host + url));
        } else {
          reject(new HttpError(404, error.message, this._host + url));
        }
      });
    });
  }

  private delete(url: string): Promise<AxiosResponse> {
    return new Promise((resolve, reject) => {
      if (typeof this._axios === "undefined" || typeof this._host === "undefined") {
        reject(new HttpError(500, "ERR_PROVIDER_UNDEFINED", "The provider's host address has not been initialized."));
      }
      this._axios.delete(url, {data: {}}).then((response: AxiosResponse) => {
        resolve(response);
      }).catch((error: AxiosError) => {
        if (error.response) {
          reject(new HttpError(error.response.data._code, error.response.data._message, this._host + url));
        } else if (error.request) {
          reject(new HttpError(404, "ERR_CONNECTION_REFUSED", this._host + url));
        } else {
          reject(new HttpError(404, error.message, this._host + url));
        }
      });
    });
  }

  public post(url: string, body: IPostableObject | IPostableObject[]): Promise<AxiosResponse> {
    return new Promise((resolve, reject) => {
      const records: object[] = [];
      if (body instanceof Array) {
        for (const record of body) {
          records.push(record.toJSON());
        }
      } else {
        records.push(body.toJSON());
      }
      this._axios.post(url, {records}).then((response: AxiosResponse) => {
        resolve(response);
      }).catch((error) => {
        if (error.response) {
          reject(new HttpError(error.response.data._code, error.response.data._message, this._host + url));
        } else if (error.request) {
          reject(new HttpError(404, "ERR_CONNECTION_REFUSED", this._host + url));
        } else {
          reject(new HttpError(404, error.message, this._host + url));
        }
      });
    });
  }

  public put(url: string, body: IPostableObject | IPostableObject[]): Promise<AxiosResponse> {
    return new Promise((resolve, reject) => {
      const records: object[] = [];
      if (body instanceof Array) {
        for (const record of body) {
          records.push(record.toJSON());
        }
      } else {
        records.push(body.toJSON());
      }
      this._axios.put(url, {records}).then((response: AxiosResponse) => {
        resolve(response);
      }).catch((error) => {
        if (error.response) {
          reject(new HttpError(error.response.data._code, error.response.data._message, this._host + url));
        } else if (error.request) {
          reject(new HttpError(404, "ERR_CONNECTION_REFUSED", this._host + url));
        } else {
          reject(new HttpError(404, error.message, this._host + url));
        }
      });
    });
  }

  /**
   * Testing method that simply 'pings' the orange alliance API.
   * @returns The 'ping' response from the orange alliance API.
   */
  public ping(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.get("ping").then((data: any) => {
        resolve(data + "");
      }).catch((err: HttpError) => reject(err));
    });
  }

  public getEvent(eventKey: string): Promise<Event> {
    return new Promise<Event>((resolve, reject) => {
      this.get("api/event/" + eventKey).then((eventsJSON: any) => {
        const events: Event[] = eventsJSON.map((eventJSON: any) => new Event().fromJSON(eventJSON));
        resolve(events.length > 0 ? events[0] : new Event());
      }).catch((err: HttpError) => reject(err));
    });
  }

  public getTeams(eventKey: string): Promise<Team[]> {
    return new Promise<Team[]>((resolve, reject) => {
      this.get("api/event/" + eventKey + "/participants").then((teamsJSON: any[]) => {
        resolve(teamsJSON.map((teamJSON: any) => new Team().fromJSON(teamJSON)));
      }).catch((err: HttpError) => reject(err));
    });
  }

  public deleteTeams(eventKey: string): Promise<AxiosResponse> {
    return this.delete("api/event/" + eventKey + "/participants");
  }

  public deleteMatchData(eventKey: string, tournamentLevel: number): Promise<AxiosResponse> {
    return this.delete("api/match/" + eventKey + "/all?level=" + tournamentLevel);
  }

  public deleteRankings(eventKey: string): Promise<AxiosResponse> {
    return this.delete("api/rank/" + eventKey);
  }

  public postEventParticipants(eventKey: string, participants: Team[]): Promise<AxiosResponse> {
    return this.post("api/event/" + eventKey + "/participants", participants);
  }

  public postMatches(eventKey: string, matches: Match[]): Promise<AxiosResponse> {
    return this.post("api/event/" + eventKey + "/matches", matches);
  }

  public postMatchDetails(eventKey: string, matches: MatchDetails[]): Promise<AxiosResponse> {
    return this.post("api/event/" + eventKey + "/matches/details", matches);
  }

  public postMatchParticipants(eventKey: string, participants: MatchParticipant[]): Promise<AxiosResponse> {
    return this.post("api/event/" + eventKey + "/matches/participants", participants);
  }

  public postRankings(eventKey: string, rankings: Ranking[]): Promise<AxiosResponse> {
    return this.post("api/rank/" + eventKey, rankings);
  }

  public putMatchResults(eventKey: string, match: Match): Promise<AxiosResponse> {
    return this.put("api/match/" + match.matchKey, match);
  }

  public putMatchDetails(eventKey: string, matchDetails: MatchDetails): Promise<AxiosResponse> {
    return this.put("api/match/" + matchDetails.matchKey + "/details", matchDetails)
  }

  public putMatchParticipants(eventKey: string, participants: MatchParticipant[]): Promise<AxiosResponse> {
    return this.put("api/match/" + participants[0].matchKey + "/participants", participants);
  }
}

export default FGCProvider.getInstance();