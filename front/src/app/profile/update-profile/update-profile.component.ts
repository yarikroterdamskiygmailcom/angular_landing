import {Component, OnInit, ElementRef, ViewChild, ɵConsole} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import {ProfileServiceService} from 'src/app/shared/profile-service.service';
import {Subscription} from 'rxjs';
import {Profile} from '../../shared/models/profile.model';
import * as moment from 'moment-timezone';
import {SignUpService} from "../../shared/sign-up.service";


@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css']
})
export class UpdateProfileComponent implements OnInit {

  constructor(private profileService: ProfileServiceService,
              private route: ActivatedRoute,
              private router: Router,
              private fb: FormBuilder,
              private signUpService: SignUpService) {}

  form;
  private subscription: Subscription;
  profile;
  profileId = '';
  timeZones: string[];
  timenow;
  networkingErr = false;

  imageUploaded = false;
  image: File;
  @ViewChild('imagePath')
  imagePath: ElementRef;
  imagePreview;
  @ViewChild('input') inputRef: ElementRef;
  newImage: any = '';
  updatedProfile;

  ngOnInit() {
    this.signUpService.setEvent({activeTab: 1});
    this.getTimeZones();
    this.route.params
      .subscribe(
        (params: Params) => {
          const id = params.id;
          this.profileId = id;
          this.fetch(id);

        }
      );

    this.form = this.fb.group({
      name: [null, [Validators.required, Validators.minLength(3)]],
      timezone: [null, [Validators.required]],
      imagePath: [''],
      gender: [null, [Validators.required, Validators.minLength(4)]],
      birthDate: ['']
    });
  }

  fetch(userid: string) {
    this.subscription = this.profileService.getProfile(userid)
      .subscribe(profile => {

        this.profile = profile;
        this.imagePreview = `/${profile.imageSrc}`;
        this.imageUploaded = true;
        this.timenow = moment.tz(new Date(), this.profile.timeZone);
        this.form.setValue({
          name: profile.userName,
          timezone: profile.timeZone,
          imagePath: '',
          gender: profile.gender,
          birthDate: profile.birthDate
        });
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSubmit() {
    const fd = new FormData();
    if (this.image) {
      fd.append('image', this.image);
      fd.append('userName', this.form.value.name);
      fd.append('birthDate', this.form.value.birthDate);
      fd.append('timeZone', this.form.value.timezone);
      fd.append('gender', this.form.value.gender);
      fd.append('tariffPlan', this.profile.tariffPlan);
      this.updatedProfile = fd;
    } else {
      this.updatedProfile = {
        userName: this.form.value.name,
        birthDate: this.form.value.birthDate,
        imageSrc: '',
        timeZone: this.form.value.timezone,
        gender: this.form.value.gender,
        tariffPlan: this.profile.tariffPlan
      };
    }
    this.profileService.updateProfile(this.profileId, this.updatedProfile)
      .subscribe(
        (profile) => {
          this.profile = profile;
          localStorage.setItem('timezone', this.profile.timeZone);
          this.router.navigate([`/profile/${this.profileId}`]);
        },
        err => {
          this.networkingErr = true;
        }
      );
  }

  onCancel() {
    this.router.navigate([`/profile/${this.profileId}`]);
  }

  getTimeZones() {
    this.timeZones = moment.tz.names();
  }

  onfileUpload(event: any) {
    const file = event.target.files[0];
    this.image = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  triggerClick() {
    this.imageUploaded = true;
    this.inputRef.nativeElement.click();
  }

}

