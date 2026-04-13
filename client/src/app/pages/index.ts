import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forum',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="forum-container"><h2>Forum</h2><p>Forum coming soon...</p></div>`,
  styles: [`.forum-container { padding: 2rem; }`],
})
export class ForumComponent {}

@Component({
  selector: 'app-assessment',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="assessment-container"><h2>Assessment</h2><p>Assessment coming soon...</p></div>`,
  styles: [`.assessment-container { padding: 2rem; }`],
})
export class AssessmentComponent {}

@Component({
  selector: 'app-analyzer',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="analyzer-container"><h2>Profile Analyzer</h2><p>Analyzer coming soon...</p></div>`,
  styles: [`.analyzer-container { padding: 2rem; }`],
})
export class AnalyzerComponent {}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="profile-container"><h2>Profile</h2><p>Profile coming soon...</p></div>`,
  styles: [`.profile-container { padding: 2rem; }`],
})
export class ProfileComponent {}

@Component({
  selector: 'app-mentorship',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="mentorship-container"><h2>Mentorship</h2><p>Mentorship coming soon...</p></div>`,
  styles: [`.mentorship-container { padding: 2rem; }`],
})
export class MentorshipComponent {}
