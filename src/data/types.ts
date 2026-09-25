/**
 * 모두의 역사 - 데이터 타입 정의
 *
 * 데이터는 전부 이 타입을 따르는 순수 데이터 파일(src/data/*.ts)로 분리되어 있습니다.
 * 새 사건/인물/왕조를 추가하려면 해당 배열에 객체 하나만 덧붙이면 됩니다.
 */

/** 문명권: 타임라인 3열 구분 */
export type Region = "east" | "korea" | "west";

/** 사건 분류 */
export type Category =
  | "war" // 전쟁·전투
  | "politics" // 정치·제도
  | "culture" // 문화·예술·종교
  | "science" // 과학·기술
  | "economy" // 경제·생활
  | "founding" // 건국·멸망
  | "movement"; // 운동·혁명

export interface GeoPoint {
  name: string;
  lat: number;
  lng: number;
}

export interface ExternalLink {
  label: string;
  url: string;
}

/** 시대 배너 */
export interface Era {
  id: string;
  name: string;
  subtitle: string;
  startYear: number;
  endYear: number;
}

/** 타임라인 사건 */
export interface HistoryEvent {
  id: string;
  year: number; // 음수는 기원전
  endYear?: number;
  title: string;
  region: Region;
  category: Category;
  place?: string; // 국가/지역 라벨 (예: 중국, 프랑스)
  summary: string;
  detail?: string;
  geo?: GeoPoint;
  personIds?: string[];
  youtubeId?: string; // 유튜브 영상 ID (임베드 재생)
  links?: ExternalLink[];
  keywords?: string[];
}

/** 인물 관계 태그 */
export interface RelationTag {
  /** 연결할 인물 id (데이터에 없으면 이름만 표시) */
  personId?: string;
  name: string;
  note?: string;
}

export interface PersonRelations {
  family?: RelationTag[];
  allies?: RelationTag[]; // 신하·측근
  rivals?: RelationTag[]; // 정적
  influencedBy?: RelationTag[]; // 영향을 받은 인물
  influenced?: RelationTag[]; // 영향을 준 인물
}

/** 분야별 업적 */
export interface AchievementGroup {
  field: "정치·제도" | "국방·군사" | "과학·기술" | "문화·학문" | "경제·민생" | "외교";
  items: string[];
}

export interface Person {
  id: string;
  name: string;
  hanja?: string;
  title?: string; // 조선 제4대 왕 / 제15대 대통령 등
  region: Region;
  birth?: number;
  death?: number;
  reignStart?: number;
  reignEnd?: number;
  portraitEmoji?: string;
  oneLiner: string;

  /** 가족·가계 */
  family?: {
    father?: string;
    mother?: string;
    birthOrder?: string; // 형제 서열 / 적서(정처·후궁 소생) 여부
    spouses?: string[];
    children?: string[];
  };

  accession?: string; // 즉위(취임) 경위
  dynastyChange?: string; // 왕조 교체 배경 (역성혁명·반정 등)
  merits?: string[]; // 공(功)
  faults?: string[]; // 과(過)
  privateLife?: string[]; // 사생활·일화
  achievements?: AchievementGroup[];
  relations?: PersonRelations;
  comparedToPredecessor?: string; // 선대와의 비교
  legacy?: string; // 후대에 끼친 영향
  places?: GeoPoint[]; // 관련 지명
  examPoints?: string[]; // 시험/상식 포인트
  eventIds?: string[];
  links?: ExternalLink[];
}

/** 왕조 / 정부 */
export interface Ruler {
  order: number; // 대수
  name: string;
  personId?: string; // 상세 프로필이 있으면 연결
  reign?: string; // 재위/재임 기간 표기
  note?: string;
}

export interface Dynasty {
  id: string;
  name: string;
  period: string;
  startYear: number;
  endYear: number;
  summary: string;
  rulers: Ruler[];
}
