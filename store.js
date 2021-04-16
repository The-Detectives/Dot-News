/* --------- Constructors --------- */

function Article(data){
  this.image=data.multimedia[0].url;
  this.category = data.section;
  this.title=data.title;
  this.url=data.url;
  this.abstract=data.abstract;
  this.published_date=data.published_date;
}

module.exports={
  Article
};
