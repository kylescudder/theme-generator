import {
  ArrowLeft,
  Search,
  Bell,
  Upload,
  HelpCircle,
  BarChart3,
  Calendar,
  Grid3X3,
  ChevronRight,
  Clock,
  MoreHorizontal,
  UserCircle,
  Plus
} from 'lucide-react'
import { mockJobs } from '@/data/jobs'
import { mockCustomers } from '@/data/customers'
import { mockFlows, currentFlow } from '@/data/flows'
import { mockSection } from '@/data/section'

interface ThemeColors {
  primary: string
  primaryRgb: string
  primaryContrast: string
  primaryContrastRgb: string
  primaryShade: string
  primaryTint: string
  secondary: string
  secondaryRgb: string
  secondaryContrast: string
  secondaryContrastRgb: string
  secondaryShade: string
  secondaryTint: string
}

interface PreviewPaneProps {
  colors: ThemeColors
}

export function PreviewPane({ colors }: PreviewPaneProps) {
  return (
    <div className='space-y-6'>
      {/* Jobs List Preview */}
      <div className='rounded-xl border bg-white shadow-lg'>
        <div className='border-b px-4 py-2'>
          <h3 className='text-sm font-semibold'>Jobs Screen</h3>
        </div>
        <div className='flex flex-col bg-gray-50'>
          <div className='flex items-center justify-between border-b bg-white p-4'>
            <div className='flex items-center space-x-3'>
              <div
                className='flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white'
                style={{ backgroundColor: colors.primary }}
              >
                <UserCircle className='h-5 w-5' />
              </div>
              <h1 className='text-xl font-bold'>Jobs</h1>
            </div>
            <div className='flex items-center space-x-3'>
              <Search className='h-5 w-5 text-gray-600' />
              <Bell className='h-5 w-5 fill-current text-gray-600' />
              <span className='flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 bg-gray-200'>
                <Upload className='h-4 w-4 text-gray-800' />
              </span>
            </div>
          </div>

          <div className='border-b bg-white px-4 py-3'>
            <div className='flex w-full overflow-hidden rounded-md bg-gray-100'>
              <button
                className='flex-1 rounded-md px-4 py-2 text-sm font-medium text-white'
                style={{ backgroundColor: colors.primary }}
              >
                All
              </button>
              <button className='flex-1 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900'>
                Active
              </button>
              <button className='flex-1 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900'>
                Scheduled
              </button>
            </div>
          </div>

          <div className='flex-1'>
            {mockJobs.map((job, index) => (
              <div
                key={index}
                className='m-2 flex items-center rounded-md border-s-4 border-[#fbbf24] bg-white p-4 shadow-xs'
              >
                <div className='min-w-0 flex-1'>
                  <h3 className='mb-1 text-base font-semibold text-gray-900'>
                    {job.title}
                  </h3>
                  <p className='mb-1 truncate text-sm text-gray-600'>
                    {job.client}
                  </p>
                  <p className='text-sm text-gray-500'>Client Ref: {job.ref}</p>
                </div>
                <div className='ml-4 text-right'>
                  <div className='mb-1 flex items-center text-sm text-gray-500'>
                    <Calendar className='mr-1 h-4 w-4' />
                    {job.date}
                  </div>
                  <div className='flex items-center text-sm text-gray-500'>
                    <Clock className='mr-1 h-4 w-4' />
                    {job.time}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className='flex border-t bg-white'>
            <div className='relative flex-1 py-3 text-center'>
              <div className='relative inline-block'>
                <BarChart3
                  className='mx-auto mb-1 h-6 w-6'
                  style={{ color: colors.primary }}
                />
                <div
                  className='absolute -top-1 -right-2 rounded-full px-1.5 py-0.5 text-xs font-bold text-white'
                  style={{ backgroundColor: colors.primary, fontSize: '10px' }}
                >
                  8
                </div>
              </div>
              <span
                className='text-xs font-medium'
                style={{ color: colors.primary }}
              >
                Jobs
              </span>
            </div>
            <div className='flex-1 py-3 text-center'>
              <HelpCircle className='mx-auto mb-1 h-6 w-6 text-gray-400' />
              <span className='text-xs text-gray-400'>Online Query</span>
            </div>
            <div className='flex-1 py-3 text-center'>
              <BarChart3 className='mx-auto mb-1 h-6 w-6 text-gray-400' />
              <span className='text-xs text-gray-400'>Power BI</span>
            </div>
            <div className='relative flex-1 py-3 text-center'>
              <Calendar className='mx-auto mb-1 h-6 w-6 text-gray-400' />
              <div
                className='absolute top-2 right-1/2 translate-x-4 rounded-full px-1.5 py-0.5 text-xs font-bold text-white'
                style={{ backgroundColor: colors.primary, fontSize: '10px' }}
              >
                0
              </div>
              <span className='text-xs text-gray-400'>Scheduled Actions</span>
            </div>
            <div className='flex-1 py-3 text-center'>
              <Grid3X3 className='mx-auto mb-1 h-6 w-6 text-gray-400' />
              <span className='text-xs text-gray-400'>Hub</span>
            </div>
          </div>
        </div>
      </div>

      {/* Customers List Preview */}
      <div className='rounded-xl border bg-white shadow-lg'>
        <div className='border-b px-4 py-2'>
          <h3 className='text-sm font-semibold'>Customers Screen</h3>
        </div>
        <div className='flex flex-col bg-gray-50'>
          <div className='flex items-center justify-between border-b bg-white p-4'>
            <div className='flex items-center space-x-3'>
              <div
                className='flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white'
                style={{ backgroundColor: colors.primary }}
              >
                KD
              </div>
              <h1 className='text-xl font-bold'>Flows</h1>
            </div>
            <div className='flex items-center space-x-3'>
              <Search className='h-5 w-5 text-gray-600' />
              <Bell className='h-5 w-5 fill-current text-gray-600' />
              <span className='flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 bg-gray-200'>
                <Upload className='h-4 w-4 text-gray-800' />
              </span>
            </div>
          </div>

          <div className='flex-1'>
            <div className='bg-gray-50 p-4'>
              <h2 className='mb-4 text-lg font-semibold'>Customers</h2>
              <div className='space-y-0'>
                {mockCustomers.map((customer, index) => (
                  <div
                    key={index}
                    className='m-2 flex items-center justify-between rounded-lg bg-white p-3'
                  >
                    <div className='flex items-center space-x-3'>
                      <div
                        className='flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold text-white'
                        style={{ backgroundColor: colors.primary }}
                      >
                        {customer.initial}
                      </div>
                      <span className='text-base font-medium text-gray-900'>
                        {customer.name}
                      </span>
                    </div>
                    <ChevronRight className='h-5 w-5 text-gray-400' />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className='flex border-t bg-white'>
            <div className='relative flex-1 py-3 text-center'>
              <div className='relative inline-block'>
                <BarChart3 className='mx-auto mb-1 h-6 w-6 text-gray-400' />
                <div
                  className='absolute -top-1 -right-2 rounded-full px-1.5 py-0.5 text-xs font-bold text-white'
                  style={{ backgroundColor: colors.primary, fontSize: '10px' }}
                >
                  8
                </div>
              </div>
              <span className='text-xs text-gray-400'>Jobs</span>
            </div>
            <div className='flex-1 py-3 text-center'>
              <HelpCircle className='mx-auto mb-1 h-6 w-6 text-gray-400' />
              <span className='text-xs text-gray-400'>Online Query</span>
            </div>
            <div className='flex-1 py-3 text-center'>
              <BarChart3 className='mx-auto mb-1 h-6 w-6 text-gray-400' />
              <span className='text-xs text-gray-400'>Power BI</span>
            </div>
            <div className='relative flex-1 py-3 text-center'>
              <Calendar className='mx-auto mb-1 h-6 w-6 text-gray-400' />
              <div
                className='absolute top-2 right-1/2 translate-x-4 rounded-full px-1.5 py-0.5 text-xs font-bold text-white'
                style={{ backgroundColor: colors.primary, fontSize: '10px' }}
              >
                0
              </div>
              <span className='text-xs text-gray-400'>Scheduled Actions</span>
            </div>
            <div className='flex-1 py-3 text-center'>
              <Grid3X3 className='mx-auto mb-1 h-6 w-6 text-gray-400' />
              <span className='text-xs text-gray-400'>Hub</span>
            </div>
          </div>
        </div>
      </div>

      {/* Flow Details Preview */}
      <div className='rounded-xl border bg-white shadow-lg'>
        <div className='border-b px-4 py-2'>
          <h3 className='text-sm font-semibold'>Flow Details</h3>
        </div>
        <div className='relative flex flex-col bg-gray-50'>
          <div className='flex items-center justify-between bg-white p-4 '>
            <div className='flex items-center space-x-2'>
              <ArrowLeft className='h-5 w-5 text-gray-700' />
              <span className='text-base font-medium'>Flow</span>
            </div>
            <div className='flex items-center space-x-3'>
              <Bell className='h-5 w-5 fill-current text-gray-600' />
            </div>
          </div>

          <div className='border-b bg-white'>
            <div className='flex w-full border-b bg-white'>
              <button
                className='-mb-px flex-1 border-b-2 px-6 py-3 text-center text-sm font-medium'
                style={{
                  color: colors.primary,
                  borderBottomColor: colors.primary
                }}
              >
                Details
              </button>
              <button className='-mb-px flex-1 border-b-2 border-transparent px-6 py-3 text-center text-sm text-gray-500 hover:text-gray-700'>
                Resources
              </button>
            </div>
          </div>

          <div className='flex-1 p-4 pb-20'>
            <h1 className='mb-1 text-xl font-bold'>{currentFlow.title}</h1>
            <div className='mb-6 text-sm text-gray-600'>
              {currentFlow.breadcrumb?.map((item, idx) => {
                if (typeof item === 'string') {
                  return <span key={`bc-text-${idx}`}>{item}</span>
                }
                const Icon = item
                const isMore = Icon === MoreHorizontal
                return (
                  <Icon
                    key={`bc-icon-${idx}`}
                    className={`h-4 w-4 inline${isMore ? '' : ' mx-1'}`}
                  />
                )
              })}
            </div>

            <div
              className='mb-6 rounded-lg border-2 border-dashed p-8'
              style={{ borderColor: colors.primary }}
            >
              <div className='flex items-center justify-center gap-2'>
                <Plus className='h-5 w-5' style={{ color: colors.primary }} />
                <span
                  className='text-base font-medium'
                  style={{ color: colors.primary }}
                >
                  Start a New Flow
                </span>
              </div>
            </div>

            <div className='mb-6'>
              <h2 className='mb-4 text-lg font-semibold'>Last 5 Flows</h2>
              <div className='space-y-3'>
                {mockFlows.map((flow) => (
                  <div
                    key={flow.id}
                    className='flex items-center justify-between rounded-lg border bg-white p-3'
                  >
                    <div className='flex items-center space-x-3'>
                      <div
                        className='flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-white'
                        style={{ backgroundColor: colors.primary }}
                      >
                        {flow.initial}
                      </div>
                      <div>
                        <div className='text-base font-medium'>
                          {flow.title}
                        </div>
                        <div className='text-sm text-gray-500'>
                          {flow.dateTime}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className='h-5 w-5 text-gray-400' />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className='absolute right-4 bottom-4'>
            <button
              className='flex h-14 w-14 items-center justify-center rounded-full text-2xl text-white shadow-lg'
              style={{ backgroundColor: colors.primary }}
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Section Details Preview */}
      <div className='rounded-xl border bg-white shadow-lg'>
        <div className='border-b px-4 py-2'>
          <h3 className='text-sm font-semibold'>Section Details</h3>
        </div>
        <div className='relative  flex min-h-[640px] flex-col bg-gray-50'>
          <div className='flex items-center justify-between bg-white p-4 '>
            <div className='flex items-center space-x-2'>
              <ArrowLeft className='h-5 w-5 text-gray-700' />
              <span className='text-base font-medium'>Back</span>
            </div>
            <div className='flex items-center space-x-3'>
              <Search className='h-5 w-5 text-gray-600' />
              <Bell className='h-5 w-5 fill-current text-gray-600' />
            </div>
          </div>

          <div className='border-b bg-white'>
            <div className='flex w-full border-b bg-white'>
              <button
                className='-mb-px flex-1 border-b-2 px-6 py-3 text-center text-sm font-medium'
                style={{
                  color: colors.primary,
                  borderBottomColor: colors.primary
                }}
              >
                Sections
              </button>
              <button className='-mb-px flex-1 border-b-2 border-transparent px-6 py-3 text-center text-sm text-gray-500 hover:text-gray-700'>
                History
              </button>
              <button className='-mb-px flex-1 border-b-2 border-transparent px-6 py-3 text-center text-sm text-gray-500 hover:text-gray-700'>
                Resources
              </button>
            </div>
          </div>

          <div className='flex-1 p-4 pb-24'>
            <h1 className='mb-4 text-xl font-bold'>{mockSection.title}</h1>

            <div className='mb-4 rounded-xl border bg-white p-4'>
              <div className='mb-3 flex items-center justify-between'>
                <span className='font-medium'>{mockSection.completeText}</span>
                <span className='text-gray-600'>
                  {mockSection.completedCount}
                </span>
              </div>
              <div
                className='h-2 rounded-full'
                style={{
                  backgroundColor: colors.primary,
                  opacity: 0.5
                }}
              >
                <div
                  className='h-2 rounded-full'
                  style={{
                    width: '0%',
                    backgroundColor: colors.primary,
                    opacity: 0.5
                  }}
                />
              </div>
            </div>

            <div className='flex items-center justify-between rounded-xl border bg-white p-4'>
              <div className='flex items-center gap-3'>
                <span className='inline-block h-5 w-5 rounded-full border-2 border-gray-400' />
                <div className='flex items-center gap-1'>
                  {mockSection.sections[0].required && (
                    <span className='text-red-500'>*</span>
                  )}
                  <span className='font-semibold'>
                    {mockSection.sections[0].title}
                  </span>
                </div>
              </div>
              <ChevronRight className='h-5 w-5 text-gray-400' />
            </div>
          </div>

          <div className='sticky bottom-0 border-t bg-white p-4'>
            <button
              className='w-full rounded-xl py-3 font-medium text-white shadow'
              style={{ backgroundColor: colors.primary }}
            >
              Start Section
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
