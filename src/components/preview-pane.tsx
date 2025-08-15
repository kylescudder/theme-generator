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
      <div className='bg-white rounded-xl shadow-lg border'>
        <div className='px-4 py-2 border-b'>
          <h3 className='font-semibold text-sm'>Jobs Screen</h3>
        </div>
        <div className='bg-gray-50 flex flex-col'>
          <div className='bg-white flex items-center justify-between p-4 border-b'>
            <div className='flex items-center space-x-3'>
              <div
                className='w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm'
                style={{ backgroundColor: colors.primary }}
              >
                <UserCircle className='w-5 h-5' />
              </div>
              <h1 className='text-xl font-bold'>Jobs</h1>
            </div>
            <div className='flex items-center space-x-3'>
              <Search className='w-5 h-5 text-gray-600' />
              <Bell className='w-5 h-5 text-gray-600 fill-current' />
              <span className='w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center border border-gray-300'>
                <Upload className='w-4 h-4 text-gray-800' />
              </span>
            </div>
          </div>

          <div className='px-4 py-3 border-b bg-white'>
            <div className='flex w-full rounded-md overflow-hidden bg-gray-100'>
              <button
                className='flex-1 px-4 py-2 text-sm font-medium text-white rounded-md'
                style={{ backgroundColor: colors.primary }}
              >
                All
              </button>
              <button className='flex-1 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 rounded-md'>
                Active
              </button>
              <button className='flex-1 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 rounded-md'>
                Scheduled
              </button>
            </div>
          </div>

          <div className='flex-1'>
            {mockJobs.map((job, index) => (
              <div
                key={index}
                className='flex items-center p-4 bg-white rounded-md shadow-xs m-2 border-s-4 border-[#fbbf24]'
              >
                <div className='flex-1 min-w-0'>
                  <h3 className='font-semibold text-gray-900 text-base mb-1'>
                    {job.title}
                  </h3>
                  <p className='text-sm text-gray-600 mb-1 truncate'>
                    {job.client}
                  </p>
                  <p className='text-sm text-gray-500'>Client Ref: {job.ref}</p>
                </div>
                <div className='text-right ml-4'>
                  <div className='flex items-center text-sm text-gray-500 mb-1'>
                    <Calendar className='w-4 h-4 mr-1' />
                    {job.date}
                  </div>
                  <div className='flex items-center text-sm text-gray-500'>
                    <Clock className='w-4 h-4 mr-1' />
                    {job.time}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className='flex border-t bg-white'>
            <div className='flex-1 text-center py-3 relative'>
              <div className='relative inline-block'>
                <BarChart3
                  className='w-6 h-6 mx-auto mb-1'
                  style={{ color: colors.primary }}
                />
                <div
                  className='absolute -top-1 -right-2 text-xs px-1.5 py-0.5 rounded-full text-white font-bold'
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
            <div className='flex-1 text-center py-3'>
              <HelpCircle className='w-6 h-6 mx-auto mb-1 text-gray-400' />
              <span className='text-xs text-gray-400'>Online Query</span>
            </div>
            <div className='flex-1 text-center py-3'>
              <BarChart3 className='w-6 h-6 mx-auto mb-1 text-gray-400' />
              <span className='text-xs text-gray-400'>Power BI</span>
            </div>
            <div className='flex-1 text-center py-3 relative'>
              <Calendar className='w-6 h-6 mx-auto mb-1 text-gray-400' />
              <div
                className='absolute top-2 right-1/2 translate-x-4 text-xs px-1.5 py-0.5 rounded-full text-white font-bold'
                style={{ backgroundColor: colors.primary, fontSize: '10px' }}
              >
                0
              </div>
              <span className='text-xs text-gray-400'>Scheduled Actions</span>
            </div>
            <div className='flex-1 text-center py-3'>
              <Grid3X3 className='w-6 h-6 mx-auto mb-1 text-gray-400' />
              <span className='text-xs text-gray-400'>Hub</span>
            </div>
          </div>
        </div>
      </div>

      {/* Customers List Preview */}
      <div className='bg-white rounded-xl shadow-lg border'>
        <div className='px-4 py-2 border-b'>
          <h3 className='font-semibold text-sm'>Customers Screen</h3>
        </div>
        <div className='bg-gray-50 flex flex-col'>
          <div className='bg-white flex items-center justify-between p-4 border-b'>
            <div className='flex items-center space-x-3'>
              <div
                className='w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm'
                style={{ backgroundColor: colors.primary }}
              >
                KD
              </div>
              <h1 className='text-xl font-bold'>Flows</h1>
            </div>
            <div className='flex items-center space-x-3'>
              <Search className='w-5 h-5 text-gray-600' />
              <Bell className='w-5 h-5 text-gray-600 fill-current' />
              <span className='w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center border border-gray-300'>
                <Upload className='w-4 h-4 text-gray-800' />
              </span>
            </div>
          </div>

          <div className='flex-1'>
            <div className='p-4 bg-gray-50'>
              <h2 className='text-lg font-semibold mb-4'>Customers</h2>
              <div className='space-y-0'>
                {mockCustomers.map((customer, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between p-3 bg-white m-2 rounded-lg'
                  >
                    <div className='flex items-center space-x-3'>
                      <div
                        className='w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm'
                        style={{ backgroundColor: colors.primary }}
                      >
                        {customer.initial}
                      </div>
                      <span className='font-medium text-base text-gray-900'>
                        {customer.name}
                      </span>
                    </div>
                    <ChevronRight className='w-5 h-5 text-gray-400' />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className='flex border-t bg-white'>
            <div className='flex-1 text-center py-3 relative'>
              <div className='relative inline-block'>
                <BarChart3 className='w-6 h-6 mx-auto mb-1 text-gray-400' />
                <div
                  className='absolute -top-1 -right-2 text-xs px-1.5 py-0.5 rounded-full text-white font-bold'
                  style={{ backgroundColor: colors.primary, fontSize: '10px' }}
                >
                  8
                </div>
              </div>
              <span className='text-xs text-gray-400'>Jobs</span>
            </div>
            <div className='flex-1 text-center py-3'>
              <HelpCircle className='w-6 h-6 mx-auto mb-1 text-gray-400' />
              <span className='text-xs text-gray-400'>Online Query</span>
            </div>
            <div className='flex-1 text-center py-3'>
              <BarChart3 className='w-6 h-6 mx-auto mb-1 text-gray-400' />
              <span className='text-xs text-gray-400'>Power BI</span>
            </div>
            <div className='flex-1 text-center py-3 relative'>
              <Calendar className='w-6 h-6 mx-auto mb-1 text-gray-400' />
              <div
                className='absolute top-2 right-1/2 translate-x-4 text-xs px-1.5 py-0.5 rounded-full text-white font-bold'
                style={{ backgroundColor: colors.primary, fontSize: '10px' }}
              >
                0
              </div>
              <span className='text-xs text-gray-400'>Scheduled Actions</span>
            </div>
            <div className='flex-1 text-center py-3'>
              <Grid3X3 className='w-6 h-6 mx-auto mb-1 text-gray-400' />
              <span className='text-xs text-gray-400'>Hub</span>
            </div>
          </div>
        </div>
      </div>

      {/* Flow Details Preview */}
      <div className='bg-white rounded-xl shadow-lg border'>
        <div className='px-4 py-2 border-b'>
          <h3 className='font-semibold text-sm'>Flow Details</h3>
        </div>
        <div className='bg-gray-50 flex flex-col relative'>
          <div className='bg-white flex items-center justify-between p-4 '>
            <div className='flex items-center space-x-2'>
              <ArrowLeft className='w-5 h-5 text-gray-700' />
              <span className='font-medium text-base'>Flow</span>
            </div>
            <div className='flex items-center space-x-3'>
              <Bell className='w-5 h-5 text-gray-600 fill-current' />
            </div>
          </div>

          <div className='border-b bg-white'>
            <div className='flex w-full border-b bg-white'>
              <button
                className='flex-1 text-center px-6 py-3 -mb-px border-b-2 text-sm font-medium'
                style={{
                  color: colors.primary,
                  borderBottomColor: colors.primary
                }}
              >
                Details
              </button>
              <button className='flex-1 text-center px-6 py-3 -mb-px border-b-2 border-transparent text-gray-500 text-sm hover:text-gray-700'>
                Resources
              </button>
            </div>
          </div>

          <div className='flex-1 p-4 pb-20'>
            <h1 className='text-xl font-bold mb-1'>{currentFlow.title}</h1>
            <div className='text-sm text-gray-600 mb-6'>
              {currentFlow.breadcrumb?.map((item, idx) => {
                if (typeof item === 'string') {
                  return <span key={`bc-text-${idx}`}>{item}</span>
                }
                const Icon = item
                const isMore = Icon === MoreHorizontal
                return (
                  <Icon
                    key={`bc-icon-${idx}`}
                    className={`w-4 h-4 inline${isMore ? '' : ' mx-1'}`}
                  />
                )
              })}
            </div>

            <div
              className='border-2 border-dashed rounded-lg p-8 mb-6'
              style={{ borderColor: colors.primary }}
            >
              <div className='flex items-center justify-center gap-2'>
                <Plus className='w-5 h-5' style={{ color: colors.primary }} />
                <span
                  className='text-base font-medium'
                  style={{ color: colors.primary }}
                >
                  Start a New Flow
                </span>
              </div>
            </div>

            <div className='mb-6'>
              <h2 className='text-lg font-semibold mb-4'>Last 5 Flows</h2>
              <div className='space-y-3'>
                {mockFlows.map((flow) => (
                  <div
                    key={flow.id}
                    className='flex items-center justify-between p-3 bg-white rounded-lg border'
                  >
                    <div className='flex items-center space-x-3'>
                      <div
                        className='w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm'
                        style={{ backgroundColor: colors.primary }}
                      >
                        {flow.initial}
                      </div>
                      <div>
                        <div className='font-medium text-base'>
                          {flow.title}
                        </div>
                        <div className='text-sm text-gray-500'>
                          {flow.dateTime}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className='w-5 h-5 text-gray-400' />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className='absolute bottom-4 right-4'>
            <button
              className='w-14 h-14 rounded-full text-white shadow-lg flex items-center justify-center text-2xl'
              style={{ backgroundColor: colors.primary }}
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Section Details Preview */}
      <div className='bg-white rounded-xl shadow-lg border'>
        <div className='px-4 py-2 border-b'>
          <h3 className='font-semibold text-sm'>Section Details</h3>
        </div>
        <div className='bg-gray-50  flex flex-col relative min-h-[640px]'>
          <div className='bg-white flex items-center justify-between p-4 '>
            <div className='flex items-center space-x-2'>
              <ArrowLeft className='w-5 h-5 text-gray-700' />
              <span className='font-medium text-base'>Back</span>
            </div>
            <div className='flex items-center space-x-3'>
              <Search className='w-5 h-5 text-gray-600' />
              <Bell className='w-5 h-5 text-gray-600 fill-current' />
            </div>
          </div>

          <div className='border-b bg-white'>
            <div className='flex w-full border-b bg-white'>
              <button
                className='flex-1 text-center px-6 py-3 -mb-px border-b-2 text-sm font-medium'
                style={{
                  color: colors.primary,
                  borderBottomColor: colors.primary
                }}
              >
                Sections
              </button>
              <button className='flex-1 text-center px-6 py-3 -mb-px border-b-2 border-transparent text-gray-500 text-sm hover:text-gray-700'>
                History
              </button>
              <button className='flex-1 text-center px-6 py-3 -mb-px border-b-2 border-transparent text-gray-500 text-sm hover:text-gray-700'>
                Resources
              </button>
            </div>
          </div>

          <div className='flex-1 p-4 pb-24'>
            <h1 className='text-xl font-bold mb-4'>{mockSection.title}</h1>

            <div className='rounded-xl border p-4 mb-4 bg-white'>
              <div className='flex items-center justify-between mb-3'>
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

            <div className='rounded-xl border p-4 bg-white flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <span className='w-5 h-5 rounded-full border-2 border-gray-400 inline-block' />
                <div className='flex items-center gap-1'>
                  {mockSection.sections[0].required && (
                    <span className='text-red-500'>*</span>
                  )}
                  <span className='font-semibold'>
                    {mockSection.sections[0].title}
                  </span>
                </div>
              </div>
              <ChevronRight className='w-5 h-5 text-gray-400' />
            </div>
          </div>

          <div className='sticky bottom-0 bg-white border-t p-4'>
            <button
              className='w-full py-3 rounded-xl text-white font-medium shadow'
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
