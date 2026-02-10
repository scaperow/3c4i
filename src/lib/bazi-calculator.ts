import lunisolar from './lunisolar'

// Constants
const TIANGAN = ['jia', 'yi', 'bing', 'ding', 'wu', 'ji', 'geng', 'xin', 'ren', 'gui']
const DIZHI = [
  'zi',
  'chou',
  'yin',
  'mao',
  'chen',
  'si',
  'wu_fire',
  'wei',
  'shen',
  'you',
  'xu',
  'hai'
]

const CHINESE_TO_CODE: { [key: string]: string } = {
  甲: 'jia',
  乙: 'yi',
  丙: 'bing',
  丁: 'ding',
  戊: 'wu',
  己: 'ji',
  庚: 'geng',
  辛: 'xin',
  壬: 'ren',
  癸: 'gui',
  子: 'zi',
  丑: 'chou',
  寅: 'yin',
  卯: 'mao',
  辰: 'chen',
  巳: 'si',
  午: 'wu_fire',
  未: 'wei',
  申: 'shen',
  酉: 'you',
  戌: 'xu',
  亥: 'hai'
}

// 八字计算工具函数
export class BaziCalculator {
  private year: number
  private month: number
  private day: number
  private hour: number
  private gender: string
  private isLunar: boolean

  // 纳音表 (Pinyin Keys)
  private readonly NAYIN_MAP: { [key: string]: string } = {
    jiazi: 'hai_zhong_jin',
    yichou: 'hai_zhong_jin',
    bingyin: 'lu_zhong_huo',
    dingmao: 'lu_zhong_huo',
    wuchen: 'da_lin_mu',
    jisi: 'da_lin_mu',
    gengwu_fire: 'lu_pang_tu',
    xinwei: 'lu_pang_tu',
    renshen: 'jian_feng_jin',
    guiyou: 'jian_feng_jin',
    jiaxu: 'shan_tou_huo',
    yihai: 'shan_tou_huo',
    bingzi: 'jian_xia_shui',
    dingchou: 'jian_xia_shui',
    wuyin: 'cheng_tou_tu',
    jimao: 'cheng_tou_tu',
    gengchen: 'bai_la_jin',
    xinsi: 'bai_la_jin',
    renwu_fire: 'yang_liu_mu',
    guiwei: 'yang_liu_mu',
    jiashen: 'quan_zhong_shui',
    yiyou: 'quan_zhong_shui',
    bingxu: 'wu_shang_tu',
    dinghai: 'wu_shang_tu',
    wuzi: 'pi_li_huo',
    jichou: 'pi_li_huo',
    gengyin: 'song_bai_mu',
    xinmao: 'song_bai_mu',
    renchen: 'chang_liu_shui',
    guisi: 'chang_liu_shui',
    jiawu_fire: 'sha_zhong_jin',
    yiwei: 'sha_zhong_jin',
    bingshen: 'shan_xia_huo',
    dingyou: 'shan_xia_huo',
    wuxu: 'ping_di_mu',
    jihai: 'ping_di_mu',
    gengzi: 'bi_shang_tu',
    xinchou: 'bi_shang_tu',
    renyin: 'jin_bo_jin',
    guimao: 'jin_bo_jin',
    jiachen: 'fu_deng_huo',
    yisi: 'fu_deng_huo',
    bingwu_fire: 'tian_he_shui',
    dingwei: 'tian_he_shui',
    wushen: 'da_yi_tu',
    jiyou: 'da_yi_tu',
    gengxu: 'chai_chuan_jin',
    xinhai: 'chai_chuan_jin',
    renzi: 'sang_zhe_mu',
    guichou: 'sang_zhe_mu',
    jiayin: 'da_xi_shui',
    yimao: 'da_xi_shui',
    bingchen: 'sha_zhong_tu',
    dingsi: 'sha_zhong_tu',
    wuwu_fire: 'tian_shang_huo',
    jiwei: 'tian_shang_huo',
    gengshen: 'shi_liu_mu',
    xinyou: 'shi_liu_mu',
    renxu: 'da_hai_shui',
    guihai: 'da_hai_shui'
  }

  // 长生十二神表 (日干对应地支) - Keys and Values are Codes
  private readonly ZHANGSHENG_MAP: { [key: string]: string[] } = {
    jia: ['hai', 'zi', 'chou', 'yin', 'mao', 'chen', 'si', 'wu_fire', 'wei', 'shen', 'you', 'xu'],
    yi: ['wu_fire', 'si', 'chen', 'mao', 'yin', 'chou', 'zi', 'hai', 'xu', 'you', 'shen', 'wei'],
    bing: ['yin', 'mao', 'chen', 'si', 'wu_fire', 'wei', 'shen', 'you', 'xu', 'hai', 'zi', 'chou'],
    ding: ['you', 'shen', 'wei', 'wu_fire', 'si', 'chen', 'mao', 'yin', 'chou', 'zi', 'hai', 'xu'],
    wu: ['yin', 'mao', 'chen', 'si', 'wu_fire', 'wei', 'shen', 'you', 'xu', 'hai', 'zi', 'chou'],
    ji: ['you', 'shen', 'wei', 'wu_fire', 'si', 'chen', 'mao', 'yin', 'chou', 'zi', 'hai', 'xu'],
    geng: ['si', 'wu_fire', 'wei', 'shen', 'you', 'xu', 'hai', 'zi', 'chou', 'yin', 'mao', 'chen'],
    xin: ['zi', 'hai', 'xu', 'you', 'shen', 'wei', 'wu_fire', 'si', 'chen', 'mao', 'yin', 'chou'],
    ren: ['shen', 'you', 'xu', 'hai', 'zi', 'chou', 'yin', 'mao', 'chen', 'si', 'wu_fire', 'wei'],
    gui: ['mao', 'yin', 'chou', 'zi', 'hai', 'xu', 'you', 'shen', 'wei', 'wu_fire', 'si', 'chen']
  }

  private readonly ZHANGSHENG_NAMES = [
    'chang_sheng',
    'mu_yu',
    'guan_dai',
    'lin_guan',
    'di_wang',
    'shuai',
    'bing',
    'si',
    'mu',
    'jue',
    'tai',
    'yang'
  ]

  // 藏干表 - Keys and Values are Codes
  private readonly CANG_GAN_MAP: { [key: string]: string[] } = {
    zi: ['gui'],
    chou: ['ji', 'gui', 'xin'],
    yin: ['jia', 'bing', 'wu'],
    mao: ['yi'],
    chen: ['wu', 'yi', 'gui'],
    si: ['bing', 'wu', 'geng'],
    wu_fire: ['ding', 'ji'],
    wei: ['ji', 'ding', 'yi'],
    shen: ['geng', 'ren', 'wu'],
    you: ['xin'],
    xu: ['wu', 'xin', 'ding'],
    hai: ['ren', 'jia']
  }

  constructor(
    year: number,
    month: number,
    day: number,
    hour: number,
    gender: string,
    isLunar: boolean
  ) {
    this.year = year
    this.month = month
    this.day = day
    this.hour = hour
    this.gender = gender
    this.isLunar = isLunar
  }

  public getBirthYear(): number {
    return this.year
  }

  // 获取天干地支
  private getTiangan(index: number): string {
    return TIANGAN[index % 10]
  }

  private getDizhi(index: number): string {
    return DIZHI[index % 12]
  }

  // 计算年柱
  getYearPillar() {
    const yearIndex = this.year - 4 // 1984年是甲子年 (jiazi)
    // 1984 - 4 = 1980. 1984 is jiazi.
    // Wait, 1984 is 4 (jia) ? No.
    // 1984 % 10 = 4. TIANGAN[4] = 'wu'. Incorrect.
    // 1984 is jiazi.
    // (1984 - 4) % 10 = 0 -> jia. Correct.
    // (1984 - 4) % 12 = 0 -> zi. Correct.
    return {
      tiangan: this.getTiangan(yearIndex),
      dizhi: this.getDizhi(yearIndex)
    }
  }

  // 计算月柱
  getMonthPillar() {
    // 简化计算，实际应该根据农历月份计算
    const monthIndex = (this.year - 4) * 12 + this.month - 1
    return {
      tiangan: this.getTiangan(monthIndex),
      dizhi: this.getDizhi(monthIndex)
    }
  }

  // 计算日柱
  getDayPillar() {
    // 简化计算，实际应该根据农历日期计算
    const dayIndex = Math.floor((this.year - 4) * 365 + this.month * 30 + this.day)
    return {
      tiangan: this.getTiangan(dayIndex),
      dizhi: this.getDizhi(dayIndex)
    }
  }

  // 计算时柱
  getHourPillar() {
    const hourIndex = Math.floor(this.hour / 2)
    return {
      tiangan: this.getTiangan(hourIndex),
      dizhi: this.getDizhi(hourIndex)
    }
  }

  // 获取十神
  getShishen(tiangan: string, dizhi: string): string {
    // Note: This logic assumes a static mapping which might be incorrect if 'dizhi' is just a branch.
    // Usually Shishen is relation between Day Master and other Stem.
    // But here it seems to map Pillar (Stem+Branch) to something?
    // Wait, the original code had `shishenMap` with keys like `甲子: 'zheng_yin'`.
    // This looks like mapping the Pillar to the Shishen of the Branch relative to the Stem?
    // Or mapping the Pillar itself?
    // '甲子' -> 'zheng_yin'. This means for 'jia' (Day Master?), 'zi' is 'zheng_yin'.
    // BUT the input is `tiangan` and `dizhi`.
    // If this function is `getShishen(dayMaster, targetStem)`, then it makes sense.
    // But the original code was: `getShishen(tiangan, dizhi)`.
    // And it used `shishenMap[tiangan + dizhi]`.
    // Let's assume it maps the relation within the pillar or for specific purpose.
    // Actually, looking at usages: `this.getShishen(yearPillar.tiangan, yearPillar.dizhi)`.
    // This seems to be getting the Shishen of the Branch relative to the Stem of the SAME pillar?
    // Or maybe it's just a lookup table for something else.
    // Let's preserve the logic but use codes.
    // We can generate the map or just calculate it.
    // The calculation logic `calculateTenGod` exists.
    // Let's see if `shishenMap` is consistent with `calculateTenGod`.
    // `jia` (Wood+) vs `zi` (Water+ -> Gui Water-).
    // Water generates Wood. Resource.
    // `zi` contains `gui` (Water-). `jia` is Wood+.
    // Water- generates Wood+. Different polarity? No.
    // `zi` is Yang Water branch, but contains Yin Water (Gui).
    // If we treat `zi` as Water.
    // Water generates Wood. Zheng Yin / Pian Yin.
    // `jia` (Yang) vs `zi` (Yang branch). Same polarity -> Pian Yin?
    // Original map: `甲子: 'zheng_yin'`.
    // So it seems it uses the Hidden Stem (Gui) of Zi? Gui is Yin. Jia is Yang. Different polarity -> Zheng Yin. Correct.

    // So `getShishen(stem, branch)` returns the Shishen of the Branch's main hidden stem relative to the Stem.
    // We can compute this instead of using a huge map!

    const mainHiddenStem = this.CANG_GAN_MAP[dizhi]?.[0]
    if (!mainHiddenStem) return 'unknown'
    return this.calculateTenGod(tiangan, mainHiddenStem)
  }

  // 获取五行
  getWuxing(item: string, _unused?: string): string {
    // item can be stem or branch code
    const wuxingMap: { [key: string]: string } = {
      jia: 'wood',
      yi: 'wood',
      bing: 'fire',
      ding: 'fire',
      wu: 'earth',
      ji: 'earth',
      geng: 'metal',
      xin: 'metal',
      ren: 'water',
      gui: 'water',
      zi: 'water',
      chou: 'earth',
      yin: 'wood',
      mao: 'wood',
      chen: 'earth',
      si: 'fire',
      wu_fire: 'fire',
      wei: 'earth',
      shen: 'metal',
      you: 'metal',
      xu: 'earth',
      hai: 'water'
    }
    return wuxingMap[item] || 'unknown'
  }

  // 获取日主五行
  getDayMasterWuxing(): string {
    const dayPillar = this.getDayPillar()
    return this.getWuxing(dayPillar.tiangan)
  }

  // 获取大运
  getDayun(): Array<{
    age: number
    tiangan: string
    dizhi: string
    wuxing: string
    shishen: string
    nayin: string
    zhangsheng: string
  }> {
    const dayun: Array<{
      age: number
      tiangan: string
      dizhi: string
      wuxing: string
      shishen: string
      nayin: string
      zhangsheng: string
    }> = []
    const startAge = this.isLunar ? 3 : 8
    const dayMaster = this.getDayPillar().tiangan

    const monthPillar = this.getMonthPillar()
    const monthTianganIndex = TIANGAN.indexOf(monthPillar.tiangan)
    const monthDizhiIndex = DIZHI.indexOf(monthPillar.dizhi)

    for (let i = 0; i < 12; i++) {
      const age = startAge + i * 10
      const tiangan = this.getTiangan(monthTianganIndex + i + 1)
      const dizhi = this.getDizhi(monthDizhiIndex + i + 1)

      const wuxing = this.getWuxing(tiangan) // Wuxing of Stem
      const shishen = this.calculateTenGod(dayMaster, tiangan) // Shishen of Stem relative to Day Master
      const nayin = this.getNayin(tiangan, dizhi)
      const zhangsheng = this.getZhangsheng(dayMaster, dizhi)

      dayun.push({ age, tiangan, dizhi, wuxing, shishen, nayin, zhangsheng })
    }

    return dayun
  }

  // 获取流年
  getLiunian(currentYear: number): Array<{
    year: number
    tiangan: string
    dizhi: string
    wuxing: string
    shishen: string
    nayin: string
    zhangsheng: string
  }> {
    const liunian: Array<{
      year: number
      tiangan: string
      dizhi: string
      wuxing: string
      shishen: string
      nayin: string
      zhangsheng: string
    }> = []
    const baseYear = 1984 // jiazi
    const dayMaster = this.getDayPillar().tiangan

    const startYear = this.year
    const yearIndex = startYear - baseYear

    for (let i = 0; i < 100; i++) {
      const year = startYear + i
      const tiangan = this.getTiangan(yearIndex + i)
      const dizhi = this.getDizhi(yearIndex + i)
      const wuxing = this.getWuxing(tiangan)
      const shishen = this.calculateTenGod(dayMaster, tiangan)
      const nayin = this.getNayin(tiangan, dizhi)
      const zhangsheng = this.getZhangsheng(dayMaster, dizhi)

      liunian.push({ year, tiangan, dizhi, wuxing, shishen, nayin, zhangsheng })
    }

    return liunian
  }

  // 获取纳音
  private getNayin(tiangan: string, dizhi: string): string {
    return this.NAYIN_MAP[tiangan + dizhi] || 'unknown'
  }

  // 获取十二长生
  private getZhangsheng(dayMaster: string, dizhi: string): string {
    const branches = this.ZHANGSHENG_MAP[dayMaster]
    if (!branches) return 'unknown'
    const index = branches.indexOf(dizhi)
    return index >= 0 ? this.ZHANGSHENG_NAMES[index] : 'unknown'
  }

  // 获取空亡 (基于日柱)
  private getKongWang(dayTiangan: string, dayDizhi: string): string {
    const tIndex = TIANGAN.indexOf(dayTiangan)
    const dIndex = DIZHI.indexOf(dayDizhi)

    let diff = dIndex - tIndex
    if (diff < 0) diff += 12

    const kongWangMap: { [key: number]: string } = {
      0: 'xu_hai', // 甲子旬 -> 10, 11 (xu, hai)
      10: 'shen_you', // 甲戌旬 -> 8, 9 (shen, you)
      8: 'wu_wei', // 甲申旬 -> 6, 7 (wu, wei)
      6: 'chen_si', // 甲午旬 -> 4, 5 (chen, si)
      4: 'yin_mao', // 甲辰旬 -> 2, 3 (yin, mao)
      2: 'zi_chou' // 甲寅旬 -> 0, 1 (zi, chou)
    }

    return kongWangMap[diff] || ''
  }

  // 获取神煞 (简化版)
  private getShenSha(
    dayTiangan: string,
    yearDizhi: string,
    dayDizhi: string,
    targetDizhi: string
  ): string[] {
    const shensha: string[] = []

    // 天乙贵人
    if (
      (dayTiangan === 'jia' || dayTiangan === 'wu' || dayTiangan === 'geng') &&
      (targetDizhi === 'chou' || targetDizhi === 'wei')
    )
      shensha.push('tian_yi_gui_ren')
    if (
      (dayTiangan === 'yi' || dayTiangan === 'ji') &&
      (targetDizhi === 'zi' || targetDizhi === 'shen')
    )
      shensha.push('tian_yi_gui_ren')
    if (
      (dayTiangan === 'bing' || dayTiangan === 'ding') &&
      (targetDizhi === 'hai' || targetDizhi === 'you')
    )
      shensha.push('tian_yi_gui_ren')
    if (
      (dayTiangan === 'ren' || dayTiangan === 'gui') &&
      (targetDizhi === 'mao' || targetDizhi === 'si')
    )
      shensha.push('tian_yi_gui_ren')
    if (dayTiangan === 'xin' && (targetDizhi === 'wu_fire' || targetDizhi === 'yin'))
      shensha.push('tian_yi_gui_ren')

    // 桃花
    const isTaoHua = (base: string, target: string) => {
      if (['shen', 'zi', 'chen'].includes(base) && target === 'you') return true
      if (['yin', 'wu_fire', 'xu'].includes(base) && target === 'mao') return true
      if (['si', 'you', 'chou'].includes(base) && target === 'wu_fire') return true
      if (['hai', 'mao', 'wei'].includes(base) && target === 'zi') return true
      return false
    }
    if (isTaoHua(yearDizhi, targetDizhi) || isTaoHua(dayDizhi, targetDizhi)) shensha.push('tao_hua')

    // 驿马
    const isYiMa = (base: string, target: string) => {
      if (['shen', 'zi', 'chen'].includes(base) && target === 'yin') return true
      if (['yin', 'wu_fire', 'xu'].includes(base) && target === 'shen') return true
      if (['si', 'you', 'chou'].includes(base) && target === 'hai') return true
      if (['hai', 'mao', 'wei'].includes(base) && target === 'si') return true
      return false
    }
    if (isYiMa(yearDizhi, targetDizhi) || isYiMa(dayDizhi, targetDizhi)) shensha.push('yi_ma')

    // 文昌
    const wenChangMap: { [key: string]: string } = {
      jia: 'si',
      yi: 'wu_fire',
      bing: 'shen',
      wu: 'shen',
      ding: 'you',
      ji: 'you',
      geng: 'hai',
      xin: 'zi',
      ren: 'yin',
      gui: 'mao'
    }
    if (wenChangMap[dayTiangan] === targetDizhi) shensha.push('wen_chang')

    return shensha
  }

  // 计算十神 (相对于日主)
  private calculateTenGod(dayMaster: string, targetStem: string): string {
    const dmIndex = TIANGAN.indexOf(dayMaster)
    const targetIndex = TIANGAN.indexOf(targetStem)

    if (dmIndex === -1 || targetIndex === -1) return ''

    const dmWuxing = Math.floor(dmIndex / 2)
    const targetWuxing = Math.floor(targetIndex / 2)

    const dmPol = dmIndex % 2
    const targetPol = targetIndex % 2

    const samePol = dmPol === targetPol

    const diff = (targetWuxing - dmWuxing + 5) % 5

    if (diff === 0) return samePol ? 'bi_jian' : 'jie_cai'
    if (diff === 1) return samePol ? 'shi_shen' : 'shang_guan'
    if (diff === 2) return samePol ? 'pian_cai' : 'zheng_cai'
    if (diff === 3) return samePol ? 'qi_sha' : 'zheng_guan'
    if (diff === 4) return samePol ? 'pian_yin' : 'zheng_yin'

    return ''
  }

  // 获取流月 (Interactive)
  getLiuYue(year: number): Array<{
    month: number
    name: string
    tiangan: string
    dizhi: string
    wuxing: string
    shishen: string
    startDate: string
  }> {
    const liuyue: Array<{
      month: number
      name: string
      tiangan: string
      dizhi: string
      wuxing: string
      shishen: string
      startDate: string
    }> = []
    const dayMaster = this.getDayPillar().tiangan
    const termIndices = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22]

    const mapChinese = (char: string) => CHINESE_TO_CODE[char] || char

    for (let i = 0; i < termIndices.length; i++) {
      const termIndex = termIndices[i]
      const [y, m, d] = lunisolar.SolarTerm.findDate(year, termIndex)
      const date = new Date(y, m - 1, d)
      const lsr = lunisolar(date)
      const pillar = lsr.char8.month
      const tiangan = mapChinese(pillar.stem.name)
      const dizhi = mapChinese(pillar.branch.name)

      liuyue.push({
        month: i + 1,
        name: lsr.solarTerm?.name || '',
        tiangan,
        dizhi,
        wuxing: this.getWuxing(tiangan),
        shishen: this.calculateTenGod(dayMaster, tiangan),
        startDate: `${m}/${d}`
      })
    }

    const [y, m, d] = lunisolar.SolarTerm.findDate(year + 1, 0)
    const date = new Date(y, m - 1, d)
    const lsr = lunisolar(date)
    const pillar = lsr.char8.month
    const tiangan = mapChinese(pillar.stem.name)
    const dizhi = mapChinese(pillar.branch.name)

    liuyue.push({
      month: 12,
      name: lsr.solarTerm?.name || '',
      tiangan,
      dizhi,
      wuxing: this.getWuxing(tiangan),
      shishen: this.calculateTenGod(dayMaster, tiangan),
      startDate: `${m}/${d}`
    })

    return liuyue
  }

  // 获取流日 (Interactive)
  getLiuRi(
    year: number,
    monthIndex: number
  ): Array<{
    day: number
    tiangan: string
    dizhi: string
    wuxing: string
    shishen: string
    date: string
    lunarDate: string
  }> {
    const liuri: Array<{
      day: number
      tiangan: string
      dizhi: string
      wuxing: string
      shishen: string
      date: string
      lunarDate: string
    }> = []
    const dayMaster = this.getDayPillar().tiangan
    const mapChinese = (char: string) => CHINESE_TO_CODE[char] || char

    let startY, startTerm
    let endY, endTerm

    if (monthIndex === 10) {
      startY = year
      startTerm = 22
      endY = year + 1
      endTerm = 0
    } else if (monthIndex === 11) {
      startY = year + 1
      startTerm = 0
      endY = year + 1
      endTerm = 2
    } else {
      startY = year
      startTerm = monthIndex * 2 + 2
      endY = year
      endTerm = startTerm + 2
    }

    const [sy, sm, sd] = lunisolar.SolarTerm.findDate(startY, startTerm)
    const [ey, em, ed] = lunisolar.SolarTerm.findDate(endY, endTerm)

    const startDate = new Date(sy, sm - 1, sd)
    const endDate = new Date(ey, em - 1, ed)

    const current = new Date(startDate)

    while (current < endDate) {
      const lsr = lunisolar(current)
      const pillar = lsr.char8.day
      const tiangan = mapChinese(pillar.stem.name)
      const dizhi = mapChinese(pillar.branch.name)

      liuri.push({
        day: current.getDate(),
        tiangan,
        dizhi,
        wuxing: this.getWuxing(tiangan),
        shishen: this.calculateTenGod(dayMaster, tiangan),
        date: `${current.getMonth() + 1}/${current.getDate()}`,
        lunarDate: `${lsr.lunar.month}/${lsr.lunar.day}`
      })
      current.setDate(current.getDate() + 1)
    }

    return liuri
  }

  // 获取流时 (Interactive)
  getLiuShi(dayStem: string): Array<{
    hour: string
    tiangan: string
    dizhi: string
    wuxing: string
    shishen: string
    timeRange: string
  }> {
    const liushi: Array<{
      hour: string
      tiangan: string
      dizhi: string
      wuxing: string
      shishen: string
      timeRange: string
    }> = []
    const dayMaster = this.getDayPillar().tiangan

    const startStemMap: { [key: string]: string } = {
      jia: 'jia',
      ji: 'jia',
      yi: 'bing',
      geng: 'bing',
      bing: 'wu',
      xin: 'wu',
      ding: 'geng',
      ren: 'geng',
      wu: 'ren',
      gui: 'ren'
    }

    const startStem = startStemMap[dayStem] || 'jia'
    let stemIndex = TIANGAN.indexOf(startStem)

    for (let i = 0; i < 12; i++) {
      const tiangan = TIANGAN[stemIndex % 10]
      const dizhi = DIZHI[i]

      let timeRange = ''
      if (i === 0) timeRange = '23:00-01:00'
      else timeRange = `${i * 2 - 1}:00-${i * 2 + 1}:00`

      liushi.push({
        hour: dizhi,
        tiangan,
        dizhi,
        wuxing: this.getWuxing(tiangan),
        shishen: this.calculateTenGod(dayMaster, tiangan),
        timeRange
      })
      stemIndex++
    }

    return liushi
  }

  // 获取完整分析
  getFullAnalysis() {
    const yearPillar = this.getYearPillar()
    const monthPillar = this.getMonthPillar()
    const dayPillar = this.getDayPillar()
    const hourPillar = this.getHourPillar()

    const dayMasterWuxing = this.getDayMasterWuxing()
    const dayun = this.getDayun()
    const liunian = this.getLiunian(this.year)

    const dayTiangan = dayPillar.tiangan
    const yearDizhi = yearPillar.dizhi
    const dayDizhi = dayPillar.dizhi

    const getPillarDetails = (pillar: { tiangan: string; dizhi: string }, isDay: boolean) => {
      const mainStar = isDay ? 'day_master' : this.calculateTenGod(dayTiangan, pillar.tiangan)
      const cangganStems = this.CANG_GAN_MAP[pillar.dizhi] || []
      const canggan = cangganStems.map((stem) => ({
        tiangan: stem,
        shishen: this.calculateTenGod(dayTiangan, stem)
      }))

      return {
        ...pillar,
        nayin: this.getNayin(pillar.tiangan, pillar.dizhi),
        shensha: this.getShenSha(dayTiangan, yearDizhi, dayDizhi, pillar.dizhi),
        xingyun: this.getZhangsheng(dayTiangan, pillar.dizhi),
        zizuo: this.getShishen(pillar.tiangan, pillar.dizhi),
        mainStar,
        canggan
      }
    }

    const kongwang = this.getKongWang(dayTiangan, dayDizhi)

    return {
      pillars: {
        year: getPillarDetails(yearPillar, false),
        month: getPillarDetails(monthPillar, false),
        day: getPillarDetails(dayPillar, true),
        hour: getPillarDetails(hourPillar, false)
      },
      kongwang,
      shishen: {
        year: this.getShishen(yearPillar.tiangan, yearPillar.dizhi),
        month: this.getShishen(monthPillar.tiangan, monthPillar.dizhi),
        day: this.getShishen(dayPillar.tiangan, dayPillar.dizhi),
        hour: this.getShishen(hourPillar.tiangan, hourPillar.dizhi)
      },
      wuxing: {
        year: this.getWuxing(yearPillar.tiangan),
        month: this.getWuxing(monthPillar.tiangan),
        day: this.getWuxing(dayPillar.tiangan),
        hour: this.getWuxing(hourPillar.tiangan)
      },
      dayMasterWuxing,
      dayun,
      liunian,
      analysis: this.getStructuredAnalysis()
    }
  }

  // 结构化分析数据 (Structured Analysis Data for i18n)
  private getStructuredAnalysis() {
    const dayMasterWuxing = this.getDayMasterWuxing()
    const dayPillar = this.getDayPillar()
    const dayShishen = this.getShishen(dayPillar.tiangan, dayPillar.dizhi)

    // Mingju (Character)
    const mingju = {
      wuxingTrait: dayMasterWuxing
    }

    // Wuxing Balance
    const wuxing = this.getWuxing(dayPillar.tiangan)
    const monthWuxing = this.getWuxing(this.getMonthPillar().tiangan)
    const yearWuxing = this.getWuxing(this.getYearPillar().tiangan)

    const wuxingBalance: string[] = []
    if (dayMasterWuxing === wuxing) wuxingBalance.push('self_strong')
    if (monthWuxing === dayMasterWuxing) wuxingBalance.push('month_support')
    if (yearWuxing === dayMasterWuxing) wuxingBalance.push('year_support')

    const wuxingInteractions: string[] = []
    if (
      (dayMasterWuxing === 'wood' && wuxing === 'fire') ||
      (dayMasterWuxing === 'fire' && wuxing === 'earth') ||
      (dayMasterWuxing === 'earth' && wuxing === 'metal') ||
      (dayMasterWuxing === 'metal' && wuxing === 'water') ||
      (dayMasterWuxing === 'water' && wuxing === 'wood')
    ) {
      wuxingInteractions.push('generating')
    } else if (
      (dayMasterWuxing === 'wood' && wuxing === 'metal') ||
      (dayMasterWuxing === 'metal' && wuxing === 'wood') ||
      (dayMasterWuxing === 'fire' && wuxing === 'water') ||
      (dayMasterWuxing === 'water' && wuxing === 'fire') ||
      (dayMasterWuxing === 'earth' && wuxing === 'wood') ||
      (dayMasterWuxing === 'wood' && wuxing === 'earth')
    ) {
      wuxingInteractions.push('clashing')
    }

    // Shishen Patterns
    const yearShishen = this.getShishen(this.getYearPillar().tiangan, this.getYearPillar().dizhi)
    const monthShishen = this.getShishen(this.getMonthPillar().tiangan, this.getMonthPillar().dizhi)
    const hourShishen = this.getShishen(this.getHourPillar().tiangan, this.getHourPillar().dizhi)

    const shishenPatterns: string[] = []
    if (yearShishen.includes('zheng_guan') || monthShishen.includes('zheng_guan'))
      shishenPatterns.push('official_exposed')
    if (yearShishen.includes('zheng_cai') || monthShishen.includes('zheng_cai'))
      shishenPatterns.push('wealth_stored')
    if (dayShishen.includes('jie_cai') || hourShishen.includes('jie_cai'))
      shishenPatterns.push('rob_wealth_seated')

    // Career
    const career: string[] = []
    if (dayShishen.includes('zheng_guan') || dayShishen.includes('qi_sha'))
      career.push('management')
    if (dayShishen.includes('zheng_cai') || dayShishen.includes('pian_cai')) career.push('business')
    if (dayShishen.includes('shang_guan') || dayShishen.includes('jie_cai')) career.push('tech')

    // Marriage
    const spouseZodiac = dayPillar.dizhi
    let marriageStability = 'neutral'
    if (dayShishen.includes('zheng_guan') || dayShishen.includes('zheng_cai'))
      marriageStability = 'stable'
    if (dayShishen.includes('shang_guan') || dayShishen.includes('jie_cai'))
      marriageStability = 'turbulent'

    return {
      mingju,
      wuxing: {
        dayMaster: dayMasterWuxing,
        balance: wuxingBalance,
        interactions: wuxingInteractions
      },
      shishen: {
        patterns: shishenPatterns
      },
      health: dayMasterWuxing,
      career,
      marriage: {
        spouseZodiac,
        stability: marriageStability
      }
    }
  }

  private getDetailedAnalysis() {
    return this.getStructuredAnalysis()
  }
}
