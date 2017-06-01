import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { InputTextModule, DialogModule, ButtonModule } from 'primeng/primeng';
import { AppComponent } from './app.component';
import { QueryTreeComponent } from './query-tree/query-tree.component';
import { AddFilterComponent } from './query-tree/add-filter/add-filter.component';

@NgModule({
  declarations: [
    AppComponent,
    QueryTreeComponent,
    AddFilterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    InputTextModule,
    DialogModule,
    ButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
