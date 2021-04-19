/* --------- Constructors --------- */

function Article(data){
  this.image=(data.multimedia)?data.multimedia[0].url:'https://scontent.famm2-3.fna.fbcdn.net/v/t1.15752-9/175592644_302046201289747_6992225176825660209_n.png?_nc_cat=102&ccb=1-3&_nc_sid=ae9488&_nc_eui2=AeGh1cjMgs-BEXP2ItA27I9Wbins-uGZt41uKez64Zm3jRYoFAT0OjTHtaFhMw1kPd5JodCh1_BVdPhEC4hJ2NWU&_nc_ohc=QSR8cTvI6xQAX-NYYjV&_nc_ht=scontent.famm2-3.fna&oh=a5364efb62819efcde8f4eb3fbc24355&oe=60A37F10' ;
  this.category = (data.section)? data.section:'No Section Available';
  this.title=(data.title)? data.title:'No Title';
  this.url=(data.url)? data.url:'No available URL ';
  this.abstract=(data.abstract)?data.abstract:'No available abstract';
  this.published_date=(data.published_date)?data.published_date:'No data for this article';
}

module.exports={
  Article
};
