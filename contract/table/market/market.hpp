enum market_type
{
    iq_token = 0
};

struct market
{
    uint64_t code;

    market()
    {
    }

    uint64_t primary_key() const
    {
        return code;
    }

    EOSLIB_SERIALIZE(
        market,
        (code))
}