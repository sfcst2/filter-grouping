import { FilterGroupingPage } from './app.po';

describe('filter-grouping App', function() {
  let page: FilterGroupingPage;

  beforeEach(() => {
    page = new FilterGroupingPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
