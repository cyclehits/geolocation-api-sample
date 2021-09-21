<template>
  <v-app>
    <v-app-bar app dark>
      <v-toolbar-title>Geolocation API Sample</v-toolbar-title>
    </v-app-bar>
    <v-main>
      <v-container>
        <h1>基準地と現在地の距離</h1>
        <v-form>
          <h4>基準地の緯度/経度</h4>
          <v-text-field
            v-model="basePosition.latitude"
            class="mb-3"
            label="基準地の緯度を入力してください"
            :messages="['初期値は東京スカイツリーの緯度']"
            clearable
          />
          <v-text-field
            v-model="basePosition.longitude"
            class="mb-3"
            label="基準地の経度を入力してください"
            :messages="['初期値は東京スカイツリーの経度']"
            clearable
          />

          <h4>現在地の緯度/経度</h4>
          <v-text-field
            v-model="position.latitude"
            class="text-field"
            label="現在地の緯度"
            :messages="['変更できません']"
            disabled
            filled
          />
          <v-text-field
            v-model="position.longitude"
            class="text-field"
            label="現在地の経度"
            :messages="['変更できません']"
            disabled
            filled
          />
        </v-form>
        <p class="mt-6 text-center subtitle-1">
          基準地と現在地の距離の距離:&nbsp;
          <span class="font-weight-bold">{{ distance }}</span>
          &nbsp;(km)
        </p>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';

type Position = {
  latitude: number;
  longitude: number;
};

/**
 * 基点ページ
 */
@Component
export default class IndexView extends Vue {
  readonly EARTH_RADIUS: number = 6371.071; // kilometer

  geolocationId: number | null = null;

  position: Position = {
    latitude: 0,
    longitude: 0
  };

  // Initial value is latitude & longitude of Tokyo Sky Tree
  basePosition: Position = {
    latitude: 35.7100627,
    longitude: 139.8085117
  };

  get distance(): string {
    // calculate distance using haversine-formula
    const baseLatitude = this.basePosition.latitude;
    const baseLongitude = this.basePosition.longitude;
    const { latitude, longitude } = this.position;

    // Convert degrees to radians
    const baseLatRadian = this.convertToRadian(baseLatitude);
    const latRadian = this.convertToRadian(latitude);

    const diffLat = latRadian - baseLatRadian; // Radian difference (latitudes)
    const diffLon = this.convertToRadian(longitude - baseLongitude); // Radian difference (longitude)

    const distance =
      2 *
      this.EARTH_RADIUS *
      Math.asin(
        Math.sqrt(
          Math.sin(diffLat / 2) * Math.sin(diffLat / 2) +
            Math.cos(baseLatRadian) *
              Math.cos(latRadian) *
              Math.sin(diffLon / 2) *
              Math.sin(diffLon / 2)
        )
      );

    return distance.toFixed(2);
  }

  mounted(): void {
    this.geolocationId = navigator.geolocation.watchPosition(this.updatePosition, this.clearWatch);
  }

  private updatePosition(pos: any): void {
    const coords = pos.coords;
    this.position = { latitude: coords.latitude, longitude: coords.longitude };
  }

  private clearWatch(err: any): void {
    if (this.geolocationId !== null) {
      navigator.geolocation.clearWatch(this.geolocationId);
    }
    console.warn(`ERROR(${err.code}):  ${err.message}`);
  }

  private convertToRadian(degree: number): number {
    return degree * (Math.PI / 180);
  }
}
</script>
