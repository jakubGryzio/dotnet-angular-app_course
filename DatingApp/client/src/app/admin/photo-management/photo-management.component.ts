import { Component, OnInit } from '@angular/core';
import { Photo } from 'src/app/_models/photo';
import { AdminService } from 'src/app/_services/admin.service';

@Component({
  selector: 'app-photo-management',
  templateUrl: './photo-management.component.html',
  styleUrls: ['./photo-management.component.css'],
})
export class PhotoManagementComponent implements OnInit {
  photos: Photo[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.getPhotosForApproval();
  }

  getPhotosForApproval() {
    return this.adminService.getPhotosForApproval().subscribe({
      next: (photo) => {
        this.photos = photo;
      },
    });
  }

  approvePhoto(id: number) {
    return this.adminService.approvePhoto(id).subscribe({
      next: () => {
        this.splicePhotos(id);
      },
    });
  }

  rejectPhoto(id: number) {
    return this.adminService.rejectPhoto(id).subscribe({
      next: () => {
        this.splicePhotos(id);
      },
    });
  }

  private splicePhotos(id: number) {
    this.photos.splice(
      this.photos.findIndex((p) => p.id == id),
      1
    );
  }
}
