import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { FeedbackService } from './feedback.service';
import { FeedbackPayload } from '../models/feedback.model';

describe('FeedbackService', () => {
  let service: FeedbackService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FeedbackService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(FeedbackService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should POST feedback payload to Formspree endpoint', () => {
    const payload: FeedbackPayload = {
      type: 'bug',
      message: 'Something is broken',
      email: 'user@example.com',
    };

    service.submitFeedback(payload).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(r => r.url.includes('formspree.io'));
    expect(req.request.method).toBe('POST');
    expect(req.request.body.type).toBe('bug');
    expect(req.request.body.message).toBe('Something is broken');
    expect(req.request.body.email).toBe('user@example.com');
    expect(req.request.body._subject).toBe('[LIV.hex Feedback] bug');

    req.flush({ ok: true });
  });

  it('should send "Not provided" when email is omitted', () => {
    const payload: FeedbackPayload = {
      type: 'improvement',
      message: 'Add dark mode toggle',
    };

    service.submitFeedback(payload).subscribe();

    const req = httpMock.expectOne(r => r.url.includes('formspree.io'));
    expect(req.request.body.email).toBe('Not provided');

    req.flush({ ok: true });
  });
});
