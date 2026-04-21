/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Baby, 
  Target, 
  RefreshCcw,
  Sparkles,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { 
  differenceInYears, 
  differenceInMonths, 
  differenceInDays, 
  differenceInWeeks,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  addYears,
  addMonths,
  addDays
} from 'date-fns';

type AgeResult = {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  totalHours: number;
  totalSeconds: number;
  totalMinutes: number;
  daysUntilNextBirthday: number;
};

export default function App() {
  const [birthDate, setBirthDate] = useState<string>('');
  const [targetDate, setTargetDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [age, setAge] = useState<AgeResult | null>(null);
  const [isArabic, setIsArabic] = useState(true);

  const targetYear = new Date(targetDate).getFullYear();

  const handleTargetYearChange = (yearStr: string) => {
    const year = parseInt(yearStr);
    if (!isNaN(year)) {
      const date = new Date(targetDate);
      date.setFullYear(year);
      setTargetDate(date.toISOString().split('T')[0]);
    }
  };

  const calculateAge = () => {
    if (!birthDate) return;

    const birth = new Date(birthDate);
    const target = new Date(targetDate);

    if (birth > target) {
      alert(isArabic ? 'تاريخ الميلاد يجب أن يكون قبل التاريخ المستهدف!' : 'Birth date must be before target date!');
      return;
    }

    // Exact years/months/days calculation
    let years = differenceInYears(target, birth);
    let birthPlusYears = addYears(birth, years);
    
    let months = differenceInMonths(target, birthPlusYears);
    let birthPlusMonths = addMonths(birthPlusYears, months);
    
    let days = differenceInDays(target, birthPlusMonths);

    // Days until next birthday
    const nextBirthday = new Date(birth);
    nextBirthday.setFullYear(target.getFullYear());
    if (nextBirthday < target) {
      nextBirthday.setFullYear(target.getFullYear() + 1);
    }
    const daysUntilNextBirthday = differenceInDays(nextBirthday, target);

    const isBirthdayToday = daysUntilNextBirthday === 0 || daysUntilNextBirthday === 365;

    const result: AgeResult = {
      years,
      months,
      days,
      totalDays: differenceInDays(target, birth),
      totalWeeks: differenceInWeeks(target, birth),
      totalHours: differenceInHours(target, birth),
      totalMinutes: differenceInMinutes(target, birth),
      totalSeconds: differenceInSeconds(target, birth),
      daysUntilNextBirthday: isBirthdayToday ? 0 : daysUntilNextBirthday
    };

    setAge(result);
  };

  const reset = () => {
    setBirthDate('');
    setAge(null);
  };

  const t = {
    title: isArabic ? 'حاسبة العمر' : 'Age Calculator',
    subtitle: isArabic ? 'اكتشف عمرك بالتفصيل' : 'Discover your age in detail',
    birthDate: isArabic ? 'تاريخ الميلاد' : 'Date of Birth',
    targetDate: isArabic ? 'التاريخ المستهدف' : 'Target Date',
    targetYear: isArabic ? 'سنة الهدف' : 'Target Year',
    calculate: isArabic ? 'احسب الآن' : 'Calculate Now',
    reset: isArabic ? 'إعادة تعيين' : 'Reset',
    years: isArabic ? 'سنوات' : 'Years',
    months: isArabic ? 'أشهر' : 'Months',
    days: isArabic ? 'أيام' : 'Days',
    weeks: isArabic ? 'أسابيع' : 'Weeks',
    hours: isArabic ? 'ساعات' : 'Hours',
    minutes: isArabic ? 'دقائق' : 'Minutes',
    seconds: isArabic ? 'ثواني' : 'Seconds',
    totalStats: isArabic ? 'إحصائيات إجمالية' : 'Total Statistics',
    nextBirthday: isArabic ? 'عيد ميلادك القادم بعد' : 'Next Birthday in',
    happyBirthday: isArabic ? 'عيد ميلاد سعيد! 🎂' : 'Happy Birthday! 🎂'
  };

  return (
    <div 
      className="min-h-screen bg-mauve-50 flex items-center justify-center p-4 font-sans"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="w-[400px] bg-white rounded-[40px] shadow-[0_25px_50px_-12px_rgba(111,66,193,0.15)] p-10 relative border border-mauve-200">
        <div className="absolute top-[15px] left-1/2 -translate-x-1/2 w-10 h-1 bg-mauve-300 rounded-full"></div>
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center mb-2">
            <h1 className="text-[28px] font-bold text-mauve-600 leading-none tracking-tight">{t.title}</h1>
          </div>
          <p className="text-sm text-mauve-500 font-medium">{t.subtitle}</p>
          
          <button 
            onClick={() => setIsArabic(!isArabic)}
            className="mt-4 text-[10px] font-bold uppercase tracking-wider py-1.5 px-4 bg-mauve-100 text-mauve-600 rounded-full hover:bg-mauve-200 transition-all border border-transparent"
          >
            {isArabic ? 'Switch to English' : 'تغيير للغة العربية'}
          </button>
        </motion.div>

        {/* Input Card/Group */}
        <div className="space-y-6 mb-8">
          <div>
            <label className="block text-[12px] font-semibold text-mauve-500 uppercase tracking-[1px] mb-3 pr-1 pl-1">
              {t.birthDate}
            </label>
            <div className="relative">
              <input 
                type="date" 
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full bg-mauve-100/50 border-2 border-mauve-200 rounded-[18px] p-4 text-base font-medium text-mauve-800 focus:border-mauve-600 outline-none transition-all cursor-pointer appearance-none"
              />
              <CalendarIcon className={`absolute ${isArabic ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 w-5 h-5 text-mauve-600 pointer-events-none`} />
            </div>
          </div>

          <div className="grid grid-cols-5 gap-3">
            <div className="col-span-3">
              <label className="block text-[12px] font-semibold text-mauve-500 uppercase tracking-[1px] mb-3 pr-1 pl-1">
                {t.targetDate}
              </label>
              <div className="relative">
                <input 
                  type="date" 
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full bg-mauve-100/50 border-2 border-mauve-200 rounded-[18px] p-4 text-base font-medium text-mauve-800 focus:border-mauve-600 outline-none transition-all cursor-pointer appearance-none"
                />
                <Target className={`absolute ${isArabic ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 w-5 h-5 text-mauve-600 pointer-events-none`} />
              </div>
            </div>
            <div className="col-span-2">
              <label className="block text-[12px] font-semibold text-mauve-500 uppercase tracking-[1px] mb-3 pr-1 pl-1">
                {t.targetYear}
              </label>
              <input 
                type="number" 
                value={targetYear}
                onChange={(e) => handleTargetYearChange(e.target.value)}
                className="w-full h-[60px] bg-mauve-100/50 border-2 border-mauve-200 rounded-[18px] p-4 text-base font-bold text-mauve-600 focus:border-mauve-600 outline-none transition-all text-center"
              />
            </div>
          </div>

          <button 
            onClick={calculateAge}
            disabled={!birthDate}
            className="w-full h-[60px] bg-mauve-600 text-white font-bold rounded-[18px] shadow-[0_10px_15px_-3px_rgba(111,66,193,0.3)] hover:bg-mauve-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            {t.calculate}
          </button>
        </div>

        {/* Results View */}
        <AnimatePresence mode="wait">
          {age ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* Result Grid */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: t.years, value: age.years },
                  { label: t.months, value: age.months },
                  { label: t.days, value: age.days }
                ].map((item, idx) => (
                  <div 
                    key={item.label}
                    className="bg-mauve-100/30 p-4 rounded-[20px] text-center border border-mauve-100/50"
                  >
                    <span className="block text-2xl font-extrabold text-mauve-600">{item.value}</span>
                    <span className="text-[11px] font-semibold text-mauve-500 uppercase mt-1">{item.label}</span>
                  </div>
                ))}
              </div>

              {/* Next Birthday Information */}
              <div className="text-center pt-6 border-t border-dashed border-mauve-300">
                <p className="text-sm font-medium text-mauve-800 mb-3">
                  {age.daysUntilNextBirthday === 0 ? t.happyBirthday : t.nextBirthday}
                </p>
                <div className="inline-flex items-center gap-2 bg-mauve-200/50 rounded-full px-4 py-2 text-[13px] text-mauve-600 font-bold">
                  <CalendarIcon className="w-4 h-4" />
                  <span>
                    {age.daysUntilNextBirthday === 0 
                      ? (isArabic ? 'اليوم هو يومك الخاص!' : 'Today is your special day!') 
                      : (isArabic ? `${age.daysUntilNextBirthday} يوم` : `${age.daysUntilNextBirthday} days`)}
                  </span>
                </div>
              </div>
            </motion.div>
          ) : (
             <div className="h-[200px] flex flex-col items-center justify-center text-center opacity-30 grayscale pointer-events-none">
                <Baby className="w-16 h-16 text-mauve-600 mb-2" />
                <p className="text-xs font-bold uppercase tracking-widest leading-relaxed">
                   {isArabic ? 'أدخل تاريخ ميلادك\nللبدء' : 'Enter birth date\nto begin'}
                </p>
             </div>
          )}
        </AnimatePresence>

        {/* Branding */}
        <div className="mt-10 text-center opacity-30 uppercase text-[10px] tracking-[2px] font-bold text-mauve-600">
          Designed for iOS & Android
        </div>
      </div>
    </div>
  );
}

