/**
 * Фото-приклади страв з Wikimedia Commons (вільні ліцензії).
 * Файли лежать у public/photos/ (кадровано до 3:2, 800×533, WebP);
 * у назві файлу — хеш вмісту, щоб офлайн-кеш оновлювався лише за зміни фото.
 * Список згенеровано скриптом scripts/photos.py; джерела — docs/PHOTOS.md.
 */

export interface DishPhoto {
  /** Файл у public/photos/ */
  file: string;
  /** Автор (як на сторінці файлу) */
  author: string;
  /** Ліцензія, напр. «CC BY-SA 4.0» */
  license: string;
  /** Посилання на текст ліцензії (порожнє для суспільного надбання) */
  licenseUrl: string;
  /** Сторінка файлу на Wikimedia Commons */
  page: string;
}

export const PHOTOS: Record<string, DishPhoto> = {
  "borshch": {
    file: "borshch.28c20809.webp",
    author: "Nillerdk",
    license: "CC BY 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by/3.0",
    page: "https://commons.wikimedia.org/wiki/File:Ukrainian_borscht.jpg",
  },
  "bulgur-z-nutom": {
    file: "bulgur-z-nutom.eb005dee.webp",
    author: "Anagoria",
    license: "CC BY 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by/3.0",
    page: "https://commons.wikimedia.org/wiki/File:2016-02-07_Bulgursalat_anagoria.JPG",
  },
  "chili-z-kvasoleiu": {
    file: "chili-z-kvasoleiu.9a4a4ee5.webp",
    author: "Carstor",
    license: "CC BY-SA 2.5",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.5",
    page: "https://commons.wikimedia.org/wiki/File:Bowl_of_chili.jpg",
  },
  "holubtsi-linyvi": {
    file: "holubtsi-linyvi.fc403362.webp",
    author: "sheila miguez",
    license: "CC BY-SA 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0",
    page: "https://commons.wikimedia.org/wiki/File:Cabbage_roll_with_tomato_sauce.jpg",
  },
  "hrechanyky": {
    file: "hrechanyky.f1fb0b06.webp",
    author: "Мандрівниця",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    page: "https://commons.wikimedia.org/wiki/File:%D0%93%D1%80%D0%B5%D1%87%D0%B0%D0%BD%D0%B8%D0%BA%D0%B8_%D0%B7_%D0%BC%27%D1%8F%D1%81%D0%BE%D0%BC._%D0%97%D0%B0%D0%B2%D0%BE%D0%B4%D1%81%D1%8C%D0%BA%D0%B5._%D0%9F%D0%BE%D0%BB%D1%82%D0%B0%D0%B2%D1%89%D0%B8%D0%BD%D0%B0._2026_01.jpg",
  },
  "hrechka-z-kurkoiu-aerohryl": {
    file: "hrechka-z-kurkoiu-aerohryl.62069490.webp",
    author: "Messir",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    page: "https://commons.wikimedia.org/wiki/File:%D0%93%D1%80%D0%B5%D1%87-%D0%BA%D0%B0%D1%88.jpg",
  },
  "hulyash": {
    file: "hulyash.010bd9f7.webp",
    author: "Aw58",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    page: "https://commons.wikimedia.org/wiki/File:Gulasz_indyczy_w_sosie_z_kasz%C4%85_gryczan%C4%85_-_20.05.2024.jpg",
  },
  "kartoplia-mikrokhvylovka-z-syrom": {
    file: "kartoplia-mikrokhvylovka-z-syrom.41b23c4e.webp",
    author: "Gerda Arendt",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    page: "https://commons.wikimedia.org/wiki/File:Baked_potato_with_quark,_Oberauroff.jpg",
  },
  "kefir-z-yablukom": {
    file: "kefir-z-yablukom.d50b5cd0.webp",
    author: "Ukko-wc",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
    page: "https://commons.wikimedia.org/wiki/File:Buttermilk-(right)-and-Milk-(left).jpg",
  },
  "khek-v-pergamenti": {
    file: "khek-v-pergamenti.5c22d6f7.webp",
    author: "stu_spivack",
    license: "CC BY-SA 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0",
    page: "https://commons.wikimedia.org/wiki/File:Halibut_en_papillote.jpg",
  },
  "khek-z-ovochamy-aerohryl": {
    file: "khek-z-ovochamy-aerohryl.a1b800c7.webp",
    author: "Armineaghayan",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    page: "https://commons.wikimedia.org/wiki/File:Pan-fried_white_fish_fillet_with_vegetables.jpg",
  },
  "kotlety-z-indychky": {
    file: "kotlety-z-indychky.a30754f7.webp",
    author: "A.Savin",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
    page: "https://commons.wikimedia.org/wiki/File:Pozharskaya_kotleta.jpg",
  },
  "kuriachyi-sup": {
    file: "kuriachyi-sup.693d2033.webp",
    author: "Hoyabird8",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
    page: "https://commons.wikimedia.org/wiki/File:Chicken_Noodle_Soup.jpg",
  },
  "kurka-kartoplia-aerohryl": {
    file: "kurka-kartoplia-aerohryl.1818d3ca.webp",
    author: "Daderot",
    license: "CC0",
    licenseUrl: "",
    page: "https://commons.wikimedia.org/wiki/File:Chicken_breast_with_paprika_and_other_spices,_sauteed_broccoli,_and_sauteed,_sliced_potato_-_Massachusetts.jpg",
  },
  "kurka-na-deku": {
    file: "kurka-na-deku.84b63577.webp",
    author: "Daderot",
    license: "CC0",
    licenseUrl: "",
    page: "https://commons.wikimedia.org/wiki/File:Butterfly_chicken_with_roasted_vegetables_-_Massachusetts.jpg",
  },
  "kurka-teriyaki": {
    file: "kurka-teriyaki.30e1a7a2.webp",
    author: "Geoff Peters from Vancouver, BC, Canada",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0",
    page: "https://commons.wikimedia.org/wiki/File:Chicken_teriyaki_and_rice_(3432812807).jpg",
  },
  "lavash-rol-z-kurkoiu": {
    file: "lavash-rol-z-kurkoiu.9336fac9.webp",
    author: "Viktorija N. Ivanov",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    page: "https://commons.wikimedia.org/wiki/File:%D0%92%D1%80%D0%B0%D0%BF_%D1%81%D0%BE_%D0%BF%D0%B8%D0%BB%D0%B5%D1%88%D0%BA%D0%BE_%D0%B7%D0%B5%D0%BB%D0%B5%D1%87%D1%83%D0%BA_%D0%B8_%D0%BA%D0%B0%D1%98%D0%B3%D0%B0%D0%BD%D0%B0.jpg",
  },
  "linyvi-vareniki": {
    file: "linyvi-vareniki.244f0ed7.webp",
    author: "Dieta Trening Suplementacja",
    license: "CC BY 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by/3.0",
    page: "https://commons.wikimedia.org/wiki/File:Pierogi_leniwe_with_yogurt.jpg",
  },
  "losos-z-rysom": {
    file: "losos-z-rysom.c31e5db8.webp",
    author: "Daderot",
    license: "CC0",
    licenseUrl: "",
    page: "https://commons.wikimedia.org/wiki/File:Grilled_salmon_and_asparagus_on_rice_-_Boston,_Massachusetts.jpg",
  },
  "lynyva-vivsianka": {
    file: "lynyva-vivsianka.aa93a544.webp",
    author: "Nervy8924",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    page: "https://commons.wikimedia.org/wiki/File:Protein_overnight_oats.jpg",
  },
  "mintai-pid-marynadom": {
    file: "mintai-pid-marynadom.2d819c4b.webp",
    author: "MOs810",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    page: "https://commons.wikimedia.org/wiki/File:Ryba_po_grecku_(Poznan).JPG",
  },
  "omlet-z-ovochamy": {
    file: "omlet-z-ovochamy.3d247ef3.webp",
    author: "Andy Li",
    license: "CC0",
    licenseUrl: "",
    page: "https://commons.wikimedia.org/wiki/File:Frittata_-_Bam%27s_Kitchen_2024-04-02.jpg",
  },
  "ovochi-z-khumusom": {
    file: "ovochi-z-khumusom.d3531b01.webp",
    author: "Jennifer from Vancouver, Canada",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0",
    page: "https://commons.wikimedia.org/wiki/File:Vegetables_and_Hummus_(7271118362).jpg",
  },
  "ovochi-z-yohurtovym-sousom": {
    file: "ovochi-z-yohurtovym-sousom.c571c52a.webp",
    author: "vintage_queen from Seattle, US",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0",
    page: "https://commons.wikimedia.org/wiki/File:Crudit%C3%A9s_with_a_dip_and_bean_dip_with_tortilla_chips.jpg",
  },
  "pasta-boloneze": {
    file: "pasta-boloneze.0c0f1376.webp",
    author: "Triplec85",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    page: "https://commons.wikimedia.org/wiki/File:Spaghetti_Bolognese_von_Unico_Tauberbischofsheim.jpg",
  },
  "pasta-z-tuntsem": {
    file: "pasta-z-tuntsem.f0768c57.webp",
    author: "Luca Nebuloni from Milan, Italy",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0",
    page: "https://commons.wikimedia.org/wiki/File:Pasta_with_tuna_and_tomatoes_(21166418558).jpg",
  },
  "perci-farshyrovani": {
    file: "perci-farshyrovani.c2f37e10.webp",
    author: "MOs810",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    page: "https://commons.wikimedia.org/wiki/File:Peppers_stuffed_with_minced_meat_with_tomato_sauce_in_Poznan.jpg",
  },
  "pitsa-na-lavashi": {
    file: "pitsa-na-lavashi.5866233a.webp",
    author: "jeffreyw",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0",
    page: "https://commons.wikimedia.org/wiki/File:Tortilla_pizza.jpg",
  },
  "plov-z-kurkoiu": {
    file: "plov-z-kurkoiu.13866fba.webp",
    author: "Юкатан",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
    page: "https://commons.wikimedia.org/wiki/File:Pilaf_with_chicken.jpg",
  },
  "ragu-z-kurkoiu": {
    file: "ragu-z-kurkoiu.6be3f440.webp",
    author: "Miansari66",
    license: "CC0",
    licenseUrl: "",
    page: "https://commons.wikimedia.org/wiki/File:Couscous_with_Chicken_and_Vegetable_Stew.JPG",
  },
  "rybni-kotlety": {
    file: "rybni-kotlety.6c6e3f63.webp",
    author: "Eraevsky",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    page: "https://commons.wikimedia.org/wiki/File:%D0%9A%D0%BE%D1%82%D0%BB%D0%B5%D1%82%D1%8B_%D1%89%D1%83%D1%87%D1%8C%D0%B8.jpg",
  },
  "salat-tunets-kvasolia": {
    file: "salat-tunets-kvasolia.b6847caf.webp",
    author: "Katrin Gilger",
    license: "CC BY-SA 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0",
    page: "https://commons.wikimedia.org/wiki/File:Insalata_di_Fagioli_e_Tonno_%E2%80%93_Bohnensalat_mit_Thunfisch_(7327273414).jpg",
  },
  "shakshuka": {
    file: "shakshuka.131982ed.webp",
    author: "Joe Mahoney",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0",
    page: "https://commons.wikimedia.org/wiki/File:Shakshuka1.jpg",
  },
  "smuzi-kefir-banan": {
    file: "smuzi-kefir-banan.bea1523f.webp",
    author: "Kari Sullivan from Austin, TX",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0",
    page: "https://commons.wikimedia.org/wiki/File:Vegan_Banana_Lassi_(348299818).jpg",
  },
  "sochevychnyi-sup": {
    file: "sochevychnyi-sup.6eabacea.webp",
    author: "jules",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0",
    page: "https://commons.wikimedia.org/wiki/File:Red_lentil_soup_bowl.jpg",
  },
  "stehna-z-ovochamy-bulgur": {
    file: "stehna-z-ovochamy-bulgur.53e510ef.webp",
    author: "HaJunkiyada",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    page: "https://commons.wikimedia.org/wiki/File:Liat_Portal_for_Foodie_Disorder_-_Grilled_chicken_thighs_with_ptitim_and_Israeli_salad.jpg",
  },
  "svynyna-z-ovochamy": {
    file: "svynyna-z-ovochamy.7e63669d.webp",
    author: "Ɱ",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    page: "https://commons.wikimedia.org/wiki/File:Pork_tenderloin_dish.png",
  },
  "syr-z-yahodamy": {
    file: "syr-z-yahodamy.771b9846.webp",
    author: "Anna",
    license: "CC BY 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by/3.0",
    page: "https://commons.wikimedia.org/wiki/File:Summer_Desert_(176103799).jpeg",
  },
  "syr-z-zelenniu": {
    file: "syr-z-zelenniu.185eb6bc.webp",
    author: "Dr. Bernd Gross",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    page: "https://commons.wikimedia.org/wiki/File:Kr%C3%A4uterquark_2.JPG",
  },
  "syrna-zapikanka": {
    file: "syrna-zapikanka.fb07dd79.webp",
    author: "Samurai2593",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    page: "https://commons.wikimedia.org/wiki/File:%D0%A1%D0%B8%D1%80%D0%BD%D0%B0_%D0%B7%D0%B0%D0%BF%D1%96%D0%BA%D0%B0%D0%BD%D0%BA%D0%B03.jpg",
  },
  "syrnyky-aerogryl": {
    file: "syrnyky-aerogryl.8a54c70e.webp",
    author: "Turzh (uk.wikipedia)",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
    page: "https://commons.wikimedia.org/wiki/File:%D0%A1%D0%B8%D1%80%D0%BD%D0%B8%D0%BA%D0%B8.JPG",
  },
  "tost-z-tuntsem": {
    file: "tost-z-tuntsem.c50a6952.webp",
    author: "Daderot",
    license: "CC0",
    licenseUrl: "",
    page: "https://commons.wikimedia.org/wiki/File:Tuna_fish_and_cornichons_mixed_with_garlic_mayonnaise,_topped_with_grape_tomatoes_and_black_pepper,_on_toasted_whole_wheat_bread,_with_baby_carrots_-_Massachusetts.jpg",
  },
  "tushkovana-kapusta": {
    file: "tushkovana-kapusta.817d7783.webp",
    author: "Dr. Bernd Gross",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    page: "https://commons.wikimedia.org/wiki/File:Bigos_(1).jpg",
  },
  "vareni-yaitsia": {
    file: "vareni-yaitsia.6ad00ac1.webp",
    author: "MmaBaggio",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    page: "https://commons.wikimedia.org/wiki/File:Boiled_Eggs_and_Tomato_slices_meal.jpg",
  },
  "vinegret-z-kvasoleiu": {
    file: "vinegret-z-kvasoleiu.bd8902a0.webp",
    author: "Oleg Brovko",
    license: "CC BY-SA 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0",
    page: "https://commons.wikimedia.org/wiki/File:Vinaigrette_salad.jpg",
  },
  "vivsianka-mikrokhvylovka": {
    file: "vivsianka-mikrokhvylovka.18735aba.webp",
    author: "Shisma",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0",
    page: "https://commons.wikimedia.org/wiki/File:Banana_blueberry_oatmeal.jpg",
  },
  "yaiechnia-z-pomidoramy": {
    file: "yaiechnia-z-pomidoramy.744e74dd.webp",
    author: "Pannet",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    page: "https://commons.wikimedia.org/wiki/File:%D0%AF%D0%B8%D1%87%D0%BD%D0%B8%D1%86%D0%B0_%D1%81_%D0%BF%D0%BE%D0%BC%D0%B8%D0%B4%D0%BE%D1%80%D0%B0%D0%BC%D0%B8.jpg",
  },
  "yogurt-z-horikhamy": {
    file: "yogurt-z-horikhamy.a3f6d1df.webp",
    author: "cyclonebill",
    license: "CC BY-SA 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0",
    page: "https://commons.wikimedia.org/wiki/File:Flickr_-_cyclonebill_-_Gr%C3%A6sk_yoghurt_med_honning_og_valn%C3%B8dder.jpg",
  },
  "yogurt-z-yahodamy": {
    file: "yogurt-z-yahodamy.e00a10da.webp",
    author: "Missvain",
    license: "CC0",
    licenseUrl: "",
    page: "https://commons.wikimedia.org/wiki/File:Granola_and_yogurt_-_Bubbles_%2B_Brunch_2018_-_Sarah_Stierch_02.jpg",
  },
};

export function photoUrl(p: DishPhoto): string {
  return `photos/${p.file}`;
}
