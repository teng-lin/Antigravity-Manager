import { CheckCircle, Mail } from 'lucide-react';
import { Account } from '../../types/account';
import { formatTimeRemaining } from '../../utils/format';
import { formatModelName } from '../../utils/model';
import { useTranslation } from 'react-i18next';

interface CurrentAccountProps {
    account: Account | null;
    onSwitch?: () => void;
}

function CurrentAccount({ account, onSwitch }: CurrentAccountProps) {
    const { t } = useTranslation();
    if (!account) {
        return (
            <div className="bg-white dark:bg-base-100 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-base-200">
                <h2 className="text-base font-semibold text-gray-900 dark:text-base-content mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {t('dashboard.current_account')}
                </h2>
                <div className="text-center py-4 text-gray-400 dark:text-gray-500 text-sm">
                    {t('dashboard.no_active_account')}
                </div>
            </div>
        );
    }

    const models = account.quota?.models || [];

    return (
        <div className="bg-white dark:bg-base-100 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-base-200 h-full flex flex-col">
            <h2 className="text-base font-semibold text-gray-900 dark:text-base-content mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                {t('dashboard.current_account')}
            </h2>

            <div className="space-y-4 flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{account.email}</span>
                </div>

                <div className="space-y-3">
                    {models.map((model) => {
                        const isClaude = model.name.toLowerCase().includes('claude');

                        return (
                            <div key={model.name} className="space-y-1.5">
                                <div className="flex justify-between items-baseline">
                                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                        {formatModelName(model.name)}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] text-gray-400 dark:text-gray-500" title={`${t('accounts.reset_time')}: ${new Date(model.reset_time).toLocaleString()}`}>
                                            {model.reset_time ? `R: ${formatTimeRemaining(model.reset_time)}` : t('common.unknown')}
                                        </span>
                                        <span className={`text-xs font-bold ${model.percentage >= 50
                                            ? (isClaude ? 'text-cyan-600 dark:text-cyan-400' : 'text-emerald-600 dark:text-emerald-400')
                                            : model.percentage >= 20
                                                ? (isClaude ? 'text-orange-600 dark:text-orange-400' : 'text-amber-600 dark:text-amber-400')
                                                : 'text-rose-600 dark:text-rose-400'
                                            }`}>
                                            {model.percentage}%
                                        </span>
                                    </div>
                                </div>
                                <div className="w-full bg-gray-100 dark:bg-base-300 rounded-full h-1.5 overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-700 ${model.percentage >= 50
                                            ? (isClaude ? 'bg-gradient-to-r from-cyan-400 to-cyan-500' : 'bg-gradient-to-r from-emerald-400 to-emerald-500')
                                            : model.percentage >= 20
                                                ? (isClaude ? 'bg-gradient-to-r from-orange-400 to-orange-500' : 'bg-gradient-to-r from-amber-400 to-amber-500')
                                                : 'bg-gradient-to-r from-rose-400 to-rose-500'
                                            }`}
                                        style={{ width: `${model.percentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {onSwitch && (
                <div className="mt-auto pt-3">
                    <button
                        className="w-full px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-base-300 rounded-lg hover:bg-gray-50 dark:hover:bg-base-200 transition-colors"
                        onClick={onSwitch}
                    >
                        {t('dashboard.switch_account')}
                    </button>
                </div>
            )}
        </div>
    );
}

export default CurrentAccount;
