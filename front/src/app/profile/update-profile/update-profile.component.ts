import { Component, OnInit, ElementRef, ViewChild, ɵConsole } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProfileServiceService } from 'src/app/shared/profile-service.service';
import { Subscription } from 'rxjs';
import { Profile } from '../../shared/models/profile.model';
import * as moment from 'moment-timezone';



@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css']
})
export class UpdateProfileComponent implements OnInit {

  constructor(private profileService: ProfileServiceService,
    private route: ActivatedRoute,
    private router: Router) { }
  form: FormGroup;
  private subscription: Subscription;
  profile;
  profileId: string = "";
  timeZones: string[];
  timenow;
  networkingErr = false;

  imageUploaded = false;
  image: File;
  @ViewChild('imagePath')
  imagePath: ElementRef;
  imagePreview;
  @ViewChild('input') inputRef: ElementRef
  newImage: any = "";
  updatedProfile;

  ngOnInit() {
    this.getTimeZones();
    this.route.params
      .subscribe(
        (params: Params) => {
          const id = params['id'];
          this.profileId = id;
          this.fetch(id)

        }
      );
    this.form = new FormGroup({
      'name': new FormControl(null, [
        Validators.required,
        Validators.minLength(3)
      ]),
      'timezone': new FormControl(null, [
        Validators.required
      ]),
      'imagePath': new FormControl("", [

      ]),
      'gender': new FormControl(null, [
        Validators.required,
        Validators.minLength(4)
      ]),
      'birthDate': new FormControl("", [


      ])

    });
  }
  fetch(userid: string) {
    this.subscription = this.profileService.getProfile(userid)
      .subscribe(profile => {

        this.profile = profile;
        console.log(profile.imageSrc)
        this.imagePreview = `http://localhost:4000/${profile.imageSrc}`
        this.imageUploaded = true;
        console.log("UUUUUUU", this.imagePreview)
        this.timenow = moment.tz(new Date(), this.profile.timeZone);
        console.log(profile.birthDate)
        this.form.setValue({
          'name': profile.userName,
          'timezone': profile.timeZone,
          'imagePath': "",
          'gender': profile.gender,
          'birthDate': profile.birthDate
        });
        console.log("!!!!!!!!!!!!!!", this.form.value.birthDate)
      })
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSubmit() {
    console.log("OK", this.image)

    const fd = new FormData()
    if (this.image) {
      fd.append('image', this.image);
      fd.append('userName', this.form.value.name)
      fd.append('birthDate', this.form.value.birthDate)
      fd.append('timeZone', this.form.value.timezone)
      fd.append('gender', this.form.value.gender)
      fd.append('tariffPlan', this.profile.tariffPlan)
      this.updatedProfile = fd;
    } else {
      this.updatedProfile = {
        userName: this.form.value.name,
        birthDate: this.form.value.birthDate,
        imageSrc: "",
        timeZone: this.form.value.timezone,
        gender: this.form.value.gender,
        tariffPlan: this.profile.tariffPlan
      }
    }
    console.log(this.updatedProfile);
    this.profileService.updateProfile(this.profileId, this.updatedProfile)
      .subscribe(
        (profile) => {
          this.profile = profile;
          localStorage.setItem('timezone', this.profile.timeZone);
          console.log(localStorage.getItem('timezone'));
          this.router.navigate([`/profile/${this.profileId}`])
        },
        err => {
          this.networkingErr = true;

        }
      )
  }
  onCancel() {
    this.router.navigate([`/profile/${this.profileId}`])
  }
  getTimeZones() {
    this.timeZones = moment.tz.names();
  }

  onfileUpload(event: any) {
    const file = event.target.files[0];
    this.image = file;
    console.log(this.image)
    const reader = new FileReader()
    reader.onload = () => {
      this.imagePreview = reader.result
    }
    reader.readAsDataURL(file)
  }

  triggerClick() {
    this.imageUploaded = true
    this.inputRef.nativeElement.click()
  }

}

