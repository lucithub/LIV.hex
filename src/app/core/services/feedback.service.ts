import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FeedbackPayload } from '../models/feedback.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FeedbackService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = environment.formspreeEndpoint;

  submitFeedback(payload: FeedbackPayload): Observable<unknown> {
    const body: Record<string, string> = {
      _subject: `[LIV.hex Feedback] ${payload.type}`,
      type: payload.type,
      message: payload.message,
    };

    if (payload.email) {
      body['email'] = payload.email;
    }

    return this.http.post(this.endpoint, body);
  }
}
