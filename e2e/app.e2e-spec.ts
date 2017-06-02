import { TextSamplePage } from './app.po';

describe('text-sample App', () => {
  let page: TextSamplePage;

  beforeEach(() => {
    page = new TextSamplePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
