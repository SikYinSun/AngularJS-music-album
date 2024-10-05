import { Component, OnInit} from '@angular/core';
import { AlbumService } from '../album.service';
import {MatDialog} from '@angular/material/dialog'
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs';
import { AlbumDetailComponent } from '../album-detail/album-detail.component';

@Component({
  selector: 'app-album-list',
  templateUrl: './album-list.component.html',
  styleUrls: ['./album-list.component.css'],
})
export class AlbumListComponent implements OnInit {
  listOfAlbums : any[] = [];
  filteredAlbums : any[] = [];
  serach : string = '';
  selectedCategory : string = "";
  categories: string[] = [];
  selectSort : string = "";


  constructor(private albumService : AlbumService, public dialog: MatDialog) {}

  ngOnInit() : void {
    this.albumService.getAlbums().subscribe((data) => {
      console.log(data.feed.entry);
      this.listOfAlbums = data.feed.entry;
      this.filteredAlbums = this.listOfAlbums;
      this.categories = this.getCategories(this.listOfAlbums);
    })
  }

  getCategories(albums: any[]): string[] {
    const uniqueCategories = new Set<string>();
    albums.forEach((album) => {
      const category = album['category']['attributes']['term'];
      uniqueCategories.add(category);
    });
    return Array.from(uniqueCategories);
  }

  searchQuery(): void {
    if (this.serach.trim() === '') {
      this.filteredAlbums = this.listOfAlbums;
    } else {
      this.filteredAlbums = this.listOfAlbums.filter((album) => {
        const albumName = album['im:name'].label.toLowerCase();
        const artistName = album['im:artist'].label.toLowerCase();
        const query = this.serach.toLowerCase();
        return albumName.includes(query) || artistName.includes(query);
      });
    }
  }

  openAlbum(album: any): void {
    this.dialog.open(AlbumDetailComponent, {
      width:'60%',
      height:'80vh',
      data: album,
      panelClass: 'my-custom-dialog',
    })
  }

  sortAlbumsByCategory(category: string): void {
    this.selectedCategory = category;

    if(category === "All"){
      this.filteredAlbums = this.listOfAlbums;
    }
    else {
      this.filteredAlbums = this.listOfAlbums.filter((album) => {
        const albumCategory = album['category']['attributes']['term'];
        return albumCategory === category;
      });
    } 
  }

  sortOptionChange(): void {
    if (this.selectSort) {
      switch (this.selectSort) {
        case 'priceLowToHigh':
          this.sortAlbumsByPriceLowToHigh();
          break;
        case 'priceHighToLow':
          this.sortAlbumsByPriceHighToLow();
          break;
        case 'artistNameAlphabetical':
          this.sortAlbumsByArtistNameAlphabetical();
          break;
        case 'releaseDateOldToNew':
          this.sortAlbumsByReleaseDateOldToNew();
          break;
        case 'releaseDateNewToOld':
          this.sortAlbumsByReleaseDateNewToOld();
          break;
      }
    }
  }

  sortAlbumsByPriceLowToHigh(): void {
    this.filteredAlbums.sort((a, b) => {
      const priceA = parseFloat(a['im:price'].attributes.amount);
      const priceB = parseFloat(b['im:price'].attributes.amount);
      return priceA - priceB;
    });   
  }

  sortAlbumsByPriceHighToLow(): void {
    this.filteredAlbums.sort((a, b) => {
      const priceA = parseFloat(a['im:price'].attributes.amount);
      const priceB = parseFloat(b['im:price'].attributes.amount);
      return priceB - priceA;
    }); 
  }

  sortAlbumsByArtistNameAlphabetical(): void {
    this.filteredAlbums.sort((a, b) => {
      const artistNameA = a['im:artist'].label.toLowerCase();
      const artistNameB = b['im:artist'].label.toLowerCase();
      return artistNameA.localeCompare(artistNameB);
    });
  }

  sortAlbumsByReleaseDateOldToNew(): void {
    this.filteredAlbums.sort((a, b) => {
      const dateA = new Date(a['im:releaseDate'].attributes.label);
      const dateB = new Date(b['im:releaseDate'].attributes.label);
      return dateA.getTime() - dateB.getTime(); 
    });
  }

  sortAlbumsByReleaseDateNewToOld(): void {
    this.filteredAlbums.sort((a, b) => {
      const dateA = new Date(a['im:releaseDate'].attributes.label);
      const dateB = new Date(b['im:releaseDate'].attributes.label);
      return dateB.getTime() - dateA.getTime(); 
    });
  }
}
