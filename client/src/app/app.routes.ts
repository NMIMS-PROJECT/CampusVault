import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CompaniesComponent } from './pages/companies/companies.component';
import { CompanyDetailComponent } from './pages/company-detail/company-detail.component';
import {
  ForumComponent,
  AssessmentComponent,
  AnalyzerComponent,
  ProfileComponent,
  MentorshipComponent,
} from './pages/index';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'companies', component: CompaniesComponent },
  { path: 'companies/:id', component: CompanyDetailComponent },
  { path: 'forum', component: ForumComponent },
  { path: 'assessment', component: AssessmentComponent },
  { path: 'analyzer', component: AnalyzerComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'mentorship', component: MentorshipComponent },
];
