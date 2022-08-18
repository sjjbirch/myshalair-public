class Healthtest < ApplicationRecord

    belongs_to :dog

    # enum pra: [:unspecified, :clear, :carrier, :affected]
    # enum fn: [:unspecified, :clear, :carrier, :affected]
    # enum aon: [:unspecified, :clear, :carrier, :affected]
    # enum ams: [:unspecified, :clear, :carrier, :affected]
    # enum bss: [:unspecified, :clear, :carrier, :affected]

end
